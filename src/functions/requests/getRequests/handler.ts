import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { WorkOrderRepository } from '@libs/repositories/WorkOrderRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    requests: Awaited<ReturnType<typeof workOrderRepository.getWorkOrders>>
}

const requests: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { last } = event.queryStringParameters
    const requests = await workOrderRepository.getWorkOrders(+last)

    return {
        requests,
    }
}

export const main = middyfy(requests)
