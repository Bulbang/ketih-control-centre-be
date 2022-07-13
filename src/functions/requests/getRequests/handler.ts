import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { badRequest } from '@hapi/boom'
import { middyfy } from '@libs/middlewares/middyfy'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    requests: {
        work_order_id: number
        peripheral_description: string
        request_type: string
        runbook: string
        location: string
        event_date: string
        action: string
    }[]
}

const requests: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { last, page, perPage, sortBy, direction } =
        event.queryStringParameters as {
            last?: number
            page?: number
            perPage?: number
            sortBy?: string
            direction?: 'asc' | 'desc'
        }
    if (direction && direction != 'asc' && direction != 'desc') {
        throw badRequest(`Unknown sort direction parameter: '${direction}'`)
    }
    try {
        const requests = await workOrderRepository.getWorkOrders({
            last,
            page,
            perPage,
            sortBy,
            direction,
        })

        return {
            requests: requests.map((req: any) => {
                const desc = JSON.parse(req.peripheral_description)
                req.peripheral_description = desc.device_type
                    ? `${desc.device_make} ${desc.device_type}`
                    : desc.computer
                req.location = null // --- !!!
                return req
            }),
        }
    } catch (error) {
        throw error.message == `Unknown column '${sortBy}' in 'order clause'`
            ? badRequest(`Unknown sortBy parameter: '${sortBy}'`)
            : error
    }
}

export const main = middyfy(requests)
