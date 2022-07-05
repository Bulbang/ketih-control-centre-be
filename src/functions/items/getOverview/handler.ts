import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    overview: Awaited<ReturnType<typeof workOrderRepository.getItemOverview>>
}

const getOverview: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const overview = await workOrderRepository.getItemOverview()

    return {
        overview,
    }
}

export const main = middyfy(getOverview)
