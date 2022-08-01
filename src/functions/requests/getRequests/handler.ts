import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { badRequest } from '@hapi/boom'
import { middyfy } from '@libs/middlewares/middyfy'
import { V_eventRepository } from '@libs/repositories/mysql/V_eventRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const v_eventRepository = new V_eventRepository(db)

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
        request_id: any
        requestor: string
        notes: string
        date_opened?: string
        date_closed: string
        location: string
        status: string
        category: string
        items: {
            device_type: string
            device_make: string
            device_model: string
            device_color: string
        }[]
        events: {
            event_id: number
            priority: number
            event_key: string
            long_desc: string
            event_date: string
            event_type: string
            short_desc: string
        }[]
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
        const requests = await v_eventRepository.getRequests({
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
