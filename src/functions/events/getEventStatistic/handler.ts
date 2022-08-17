import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { EventRepository } from '@libs/repositories/mysql/EventRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const eventRepository = new EventRepository(db)

type LambdaReturn = { events: number | unknown }

const getEventStatistic: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { interval, phase, priority, status } =
        event.queryStringParameters as {
            interval?: string
            priority?: string
            status?: string
            phase?: string
        }

    const [stats] = await eventRepository.getEventStats({
        last: interval ? +interval : undefined,
        phase: phase?.toLowerCase(),
        priority: priority ? +priority : undefined,
        status: status?.split('_').join(' ').toLowerCase(),
    })

    return stats
}

export const main = middyfy(getEventStatistic)
