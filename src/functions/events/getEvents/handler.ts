import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { EventRepository } from '@libs/repositories/EventRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const eventRepository = new EventRepository(db)

type LambdaReturn = {
    events: Awaited<ReturnType<typeof eventRepository.getAllEvents>>
    totalEvents: number
    incidents: number
}

const getEvents: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const events = await eventRepository.getAllEvents()

    return {
        events,
        totalEvents: events.length,
        incidents: events.reduce((prevVal, event) => {
            if (event.incident_id) return prevVal + 1
            delete event.incident_action
            delete event.incident_id
            delete event.incident_notes
            return prevVal
        }, 0),
    }
}

export const main = middyfy(getEvents)
