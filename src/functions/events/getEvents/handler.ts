import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { EventRepository } from '@libs/repositories/mysql/EventRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const eventRepository = new EventRepository(db)

type LambdaReturn = {
    events: {
        event_id: number
        event_type: string
        action: string
        country: string
        latitude: number
        longitude: number
        short_desc: string
        long_desc: string
    }[]
}

const getEvents: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage, countryCode, type } =
        event.queryStringParameters as {
            page?: number
            perPage?: number
            countryCode?: string
            type?: string
        }
    const events = await eventRepository.getAllEvents({
        perPage,
        page,
        countryCode,
        type,
    })

    return {
        events,
    }
}

export const main = middyfy(getEvents)
