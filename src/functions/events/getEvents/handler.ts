import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { Database } from '@declarations/db/tables'
import { badRequest } from '@hapi/boom'
import { middyfy } from '@libs/middlewares/middyfy'
import { V_eventRepository } from '@libs/repositories/mysql/V_eventRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const eventRepository = new V_eventRepository(db)

const statuses = ['open', 'in-progress', 'closed']

type LambdaReturn = {
    events: {
        event_id: number
        event_date: string
        priority: number
        event_key: string
        request: { request_id: string; status: string }
        status: string
        long_desc: string
        event_type: string
        incident: {
            notes: any
            start_date: string
            incident_id: number
            last_modified: string
        }
    }[]
}

const getEvents: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage, sortBy, direction } =
        event.queryStringParameters as {
            page?: number
            perPage?: number
            sortBy?: keyof Database['v_event']
            direction?: 'asc' | 'desc'
        }
    if (direction && direction != 'asc' && direction != 'desc') {
        throw badRequest(`Unknown sort direction parameter: '${direction}'`)
    }

    try {
        const events = await eventRepository.getAllEvents({
            perPage,
            page,
            sortBy,
            direction,
        })

        console.log(events)

        return {
            events: events.map((event) => {
                event.request.status =
                    statuses[Math.round(Math.random() * (statuses.length - 1))]
                return event
            }),
        }
    } catch (error) {
        if (error.message == `Unknown column '${sortBy}' in 'order clause'`) {
            throw badRequest(error.message)
        }
        throw error
    }
}

export const main = middyfy(getEvents)
