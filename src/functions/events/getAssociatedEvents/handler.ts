import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { EventRepository } from '@libs/repositories/mysql/EventRepository'

const db = createDbConnection()
const eventRepository = new EventRepository(db)

type LambdaReturn = {
    events: {
        event_id: number
        event_date: number
        priority: number
        event_key: string
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

const getAssociatedEvents: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { event_id } = event.pathParameters

    const events = await eventRepository.getAssociatedEvents(+event_id)

    return { events }
}

export const main = middyfy(getAssociatedEvents)
