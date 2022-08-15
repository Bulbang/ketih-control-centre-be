import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    total: number
    expedited: number
    saturday_delivery: number
    ground: number
}

const getRequestsByService: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { last } = event.queryStringParameters as {
        last?: string
    }
    const [reqsByService] = await workOrderRepository.getReqsByService({
        last: last ? +last : undefined,
    })

    return {
        ...reqsByService,
    }
}

export const main = middyfy(getRequestsByService)
