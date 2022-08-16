import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    [date: string]: { status: string; total: number }[]
}

const getRequestsByActionDateAndStatus: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { interval } = event.queryStringParameters as {
        interval?: string
    }

    const data = await workOrderRepository.getReqsByActionDateAndDeliveryStatus(
        { last: interval ? +interval : undefined },
    )

    const dates = [...new Set(data.map((item) => item.action_date))]
    const res: {
        [date: string]: { status: string; total: number }[]
    } = {}

    dates.forEach((date) => {
        res[date.toISOString().split('T')[0]] = data
            .filter((item) => `${item.action_date}` == `${date}`)
            .map((item) => {
                return { status: item.statuses[0], total: item.statuses.length }
            })
    })

    return res
}

export const main = middyfy(getRequestsByActionDateAndStatus)
