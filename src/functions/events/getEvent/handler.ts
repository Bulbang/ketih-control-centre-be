import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { EventRepository } from '@libs/repositories/mysql/EventRepository'

const db = createDbConnection()
const eventRepository = new EventRepository(db)

type LambdaReturn = {
    event_id: number
    event_date: number
    event_type: string
    work_order_id: number
    short_desc: string
    long_desc: string
}

const getEvent: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { id } = event.pathParameters

    const [xperiencEvent] = await eventRepository.getEvent(+id)

    return xperiencEvent
}

export const main = middyfy(getEvent)
