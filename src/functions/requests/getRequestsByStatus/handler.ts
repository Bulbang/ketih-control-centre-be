import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    total: number
    other: number
    top_statuses: {
        name: string
        total: number
    }[]
}

const getRequestsByStatus: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { last } = event.queryStringParameters as {
        last?: string
    }

    const statuses = (await workOrderRepository.getReqsByStatus({
        last: last ? +last : undefined,
    })) as {
        name: string
        total: number
    }[]

    const total = statuses.reduce((counter, asset) => {
        const totalByMake = asset.total as number
        return totalByMake + counter
    }, 0)
    const top_statuses = statuses.splice(0, 5)
    const other =
        total -
        top_statuses.reduce((counter, asset) => {
            const totalByMake = asset.total as number
            return totalByMake + counter
        }, 0)

    return {
        total,
        other,
        top_statuses,
    }
}

export const main = middyfy(getRequestsByStatus)
