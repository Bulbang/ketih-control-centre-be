import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { WorkOrderRepository } from '@libs/repositories/WorkOrderRepository'
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
    const { last, page, perPage } = event.queryStringParameters as {
        last?: number
        page?: number
        perPage?: number
    }
    const requests = await workOrderRepository.getWorkOrders({
        last,
        page,
        perPage,
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
}

export const main = middyfy(requests)
