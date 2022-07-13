import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { EventRepository } from '@libs/repositories/mysql/EventRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const eventRepository = new EventRepository(db)

type LambdaReturn = { events: number | unknown; incidents: number | unknown }

const getEventStatistic: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const [stats] = await eventRepository.getEventStats()

    return stats
}

export const main = middyfy(getEventStatistic)
