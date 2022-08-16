import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { EventRepository } from '@libs/repositories/mysql/EventRepository'

const db = createDbConnection()
const eventRepository = new EventRepository(db)

type LambdaReturn = {
    request: {
        request_id: number
        notes: any
        impacted_user_id: string
        category: string
        date_opened: number
        date_closed: number
        location: string
        serial_numbers: string[]
    }
}

const getAssociatedRequest: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { event_id } = event.pathParameters

    const [request] = await eventRepository.getAssociatedRequest(+event_id)

    return {
        request,
    }
}

export const main = middyfy(getAssociatedRequest)
