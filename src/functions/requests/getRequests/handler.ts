import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { badRequest } from '@hapi/boom'
import { middyfy } from '@libs/middlewares/middyfy'
import { V_eventRepository } from '@libs/repositories/mysql/V_eventRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const v_eventRepository = new V_eventRepository(db)

type LambdaReturn = {
    requests: {
        request_id: any
        requestor: string
        notes: string
        date_opened?: string
        date_closed: string
        impacted_user_id: string
        location: string
        status: string
        category: string
        serial_numbers: string[]
        incidents_count: unknown
        priority: number
        events: {
            event_id: number
            priority: number
            event_key: string
            long_desc: string
            event_date: string
            event_type: string
            short_desc: string
            incident: {
                incident_id: number
                start_date: string
                last_modified: string
            }
        }[]
    }[]
}

const requests: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { last, page, perPage, sortBy, direction, filter } =
        event.queryStringParameters as {
            last?: string
            page?: string
            perPage?: string
            sortBy?: string
            direction?: 'asc' | 'desc'
            filter?: string
        }
    if (direction && direction != 'asc' && direction != 'desc') {
        throw badRequest(`Unknown sort direction parameter: '${direction}'`)
    }
    try {
        const requests = await v_eventRepository.getRequests({
            last: last ? +last : undefined,
            page: page ? +page : undefined,
            perPage: perPage ? +perPage : undefined,
            sortBy,
            direction,
            filter: filter?.toLowerCase(),
        })

        return {
            requests,
        }
    } catch (error) {
        throw error.message == `Unknown column '${sortBy}' in 'order clause'`
            ? badRequest(`Unknown sortBy parameter: '${sortBy}'`)
            : error
    }
}

export const main = middyfy(requests)
