import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    total: number
    other: number
    top_services: {
        name: string
        total: number
    }[]
}

const getRequestsByService: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const service_types = (await workOrderRepository.getReqsByService()) as {
        name: string
        total: number
    }[]

    const total = service_types.reduce((counter, asset) => {
        const totalByMake = asset.total as number
        return totalByMake + counter
    }, 0)
    const top_services = service_types.splice(0, 5)
    const other =
        total -
        top_services.reduce((counter, asset) => {
            const totalByMake = asset.total as number
            return totalByMake + counter
        }, 0)

    return {
        total,
        other,
        top_services,
    }
}

export const main = middyfy(getRequestsByService)
