import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    total: number
    // other: number
    categories: {
        name: string
        total: number
    }[]
}

const getRequestsByCategory: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { interval } = event.queryStringParameters as {
        interval?: string
    }
    const allCategories = (await workOrderRepository.getReqsByCategory({
        last: interval ? +interval : undefined,
    })) as {
        name: string
        total: number
    }[]

    const total = allCategories.reduce((counter, asset) => {
        const totalByMake = asset.total as number
        return totalByMake + counter
    }, 0)
    const categories = allCategories.splice(0, 5)
    // const other =
    //     total -
    //     categories.reduce((counter, asset) => {
    //         const totalByMake = asset.total as number
    //         return totalByMake + counter
    //     }, 0)

    return {
        // other,
        total: categories.reduce(
            (counter, category) => counter + category.total,
            0,
        ),
        categories,
    }
}

export const main = middyfy(getRequestsByCategory)
