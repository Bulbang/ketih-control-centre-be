import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    total: number
    other: number
    top_item_types: {
        name: string
        total: number
    }[]
}

const getAdvancedReplacementsByItemType: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { interval } = event.queryStringParameters as {
        interval?: string
    }
    const item_types =
        (await workOrderRepository.getAdvancedReplacementsByItemType({
            last: interval ? +interval : undefined,
        })) as {
            name: string
            total: number
        }[]

    const total = item_types.reduce((counter, asset) => {
        const totalByMake = asset.total as number
        return totalByMake + counter
    }, 0)
    const top_item_types = item_types.filter((type) => type.name).splice(0, 5)
    const other =
        total -
        top_item_types.reduce((counter, asset) => {
            const totalByMake = asset.total as number
            return totalByMake + counter
        }, 0)

    return {
        total,
        other,
        top_item_types,
    }
}

export const main = middyfy(getAdvancedReplacementsByItemType)
