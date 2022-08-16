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
    const { interval } = event.queryStringParameters as {
        interval?: string
    }
    const stats = await workOrderRepository.getWorkOrderStats({
        last: interval ? +interval : undefined,
    })

    return stats
}

export const main = middyfy(getRequestStats)
