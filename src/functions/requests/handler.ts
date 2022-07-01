import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { WorkOrderRepository } from '@libs/repositories/WorkOrderRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    requests: Awaited<ReturnType<typeof workOrderRepository.getWorkOrders>>
    atRiskOfSLA: number
    incidents: number
    totalEvents: number
}

const requests: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { last } = event.queryStringParameters
    const requests = await workOrderRepository.getWorkOrders(+last)

    return {
        requests,
        totalEvents: requests.length,
        atRiskOfSLA: requests.reduce(
            (previousVal, request) =>
                request.request_type.includes('Accidental Damage')
                    ? previousVal + 1
                    : previousVal,
            0,
        ),
        incidents: requests.reduce(
            (previousVal, request) =>
                request.request_type.split('-').length > 1
                    ? previousVal + 1
                    : previousVal,
            0,
        ),
    }
}

export const main = middyfy(requests)
