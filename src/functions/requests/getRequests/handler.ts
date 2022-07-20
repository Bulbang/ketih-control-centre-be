import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { badRequest } from '@hapi/boom'
import { middyfy } from '@libs/middlewares/middyfy'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

const categories = [
    'on-boarding',
    'advance_replacement',
    'support_device',
    'device_refresh',
]
const statuses = [
    'open',
    'assigned',
    'acknowledged',
    'on-hold',
    'closed',
    'complete',
    'canceled',
]

type LambdaReturn = {
    requests: {
        work_order_id: any
        runbook: string
        status: string
        end_date?: string
        category: string
        location: string
        event_date: number
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
            requests: requests.map((req) => {
                return {
                    ...req,
                    status: statuses[
                        Math.round(Math.random() * (statuses.length - 1))
                    ],
                    category:
                        categories[
                            Math.round(Math.random() * (categories.length - 1))
                        ],
                }
            }),
        }
    } catch (error) {
        throw error.message == `Unknown column '${sortBy}' in 'order clause'`
            ? badRequest(`Unknown sortBy parameter: '${sortBy}'`)
            : error
    }
}

export const main = middyfy(requests)
