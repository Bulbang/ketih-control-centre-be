import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { ItemRepository } from '@libs/repositories/ItemRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const itemRepository = new ItemRepository(db)

type LambdaReturn = {
    ordersCount: Awaited<
        ReturnType<typeof itemRepository.countOrdersByDeviceType>
    >
}

const getOrders: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const ordersCount = await itemRepository.countOrdersByDeviceType()

    return {
        ordersCount,
    }
}

export const main = middyfy(getOrders)
