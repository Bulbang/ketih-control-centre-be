import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    orders_сount: number
}

const getRequestStats: ValidatedEventAPIGatewayProxyEvent<
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
    const stats = await workOrderRepository.getWorkOrderStats({
        last: interval ? +interval : undefined,
        phase: phase?.toLowerCase(),
        priority: priority ? +priority : undefined,
        status: status?.split('_').join(' ').toLowerCase(),
    })

    return stats
}

export const main = middyfy(getRequestStats)
