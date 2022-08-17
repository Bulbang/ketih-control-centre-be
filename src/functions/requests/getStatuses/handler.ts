import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { EventTypeRepository } from '@libs/repositories/mysql/EventClassificationRepository'

const db = createDbConnection()
const eventTypeRepository = new EventTypeRepository(db)

type LambdaReturn = {
    status: string
}[]

const getStatuses: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const statuses = await eventTypeRepository.getEventTypes()

    const mappedStatuses: string[] = [
        ...new Set(statuses.map((statusObj) => statusObj.status)),
    ]

    const response: LambdaReturn = mappedStatuses.map((status) => {
        return { status }
    })

    return response
}

export const main = middyfy(getStatuses)
