import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = Awaited<
    ReturnType<typeof workOrderRepository.getWorkOrderStats>
>

const getRequestStats: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { last } = event.queryStringParameters
    const stats = await workOrderRepository.getWorkOrderStats(+last)

    return stats
}

export const main = middyfy(getRequestStats)
