import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { Database } from '@declarations/db/tables'
import { badRequest } from '@hapi/boom'
import { middyfy } from '@libs/middlewares/middyfy'
import { V_eventRepository } from '@libs/repositories/mysql/V_eventRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const eventRepository = new V_eventRepository(db)

type LambdaReturn = {
    events: {
        event_id: number
        event_date: string
        priority: number
        event_key: string
        request: { request_id: string; notes: string; serial_numbers: string[] }
        status: string
        long_desc: string
        event_type: string
        incident_count: any
        incidents: {
            start_date: string
            incident_id: number
            last_modified: string
            response: string
        }[]
    }[]
}

const getEvents: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage, sortBy, direction, interval, status, priority } =
        event.queryStringParameters as {
            interval?: string
            page?: string
            perPage?: string
            sortBy?: keyof Database['v_event']
            direction?: 'asc' | 'desc'
            status?: string
            priority?: number
        }
    if (direction && direction != 'asc' && direction != 'desc') {
        throw badRequest(`Unknown sort direction parameter: '${direction}'`)
    }

    try {
        const events = await eventRepository.getAllEvents({
            last: interval ? +interval : undefined,
            perPage: perPage ? +perPage : undefined,
            page: page ? +page : undefined,
            sortBy,
            direction,
            priority: priority ? +priority : undefined,
            status: status?.split('_').join(' ').toLowerCase(),
        })

        return {
            events,
        }
    } catch (error) {
        if (error.message == `Unknown column '${sortBy}' in 'order clause'`) {
            throw badRequest(error.message)
        }
        throw error
    }
}

export const main = middyfy(getEvents)
