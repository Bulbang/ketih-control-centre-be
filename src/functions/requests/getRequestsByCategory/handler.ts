import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    total: number
    categories: {
        name: string
        total: number
    }[]
}

const getRequestsByCategory: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const categories = (await workOrderRepository.getReqsByCategory()) as {
        name: string
        total: number
    }[]

    return {
        total: categories.reduce(
            (counter, category) => counter + category.total,
            0,
        ),
        categories,
    }
}

export const main = middyfy(getRequestsByCategory)
