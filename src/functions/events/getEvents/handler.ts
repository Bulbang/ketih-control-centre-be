import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { EventRepository } from '@libs/repositories/EventRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const eventRepository = new EventRepository(db)

type LambdaReturn = {
    events: Awaited<ReturnType<typeof eventRepository.getAllEvents>>
}

const getEvents: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage } = event.queryStringParameters as unknown as {
        page: number
        perPage: number
    }
    const events = await eventRepository.getAllEvents({ perPage, page })

    return {
        events,
    }
}

export const main = middyfy(getEvents)
