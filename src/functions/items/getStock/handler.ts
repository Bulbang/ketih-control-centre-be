import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { ItemRepository } from '@libs/repositories/ItemRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { Devices } from '@declarations/utils'

const db = createDbConnection()
const itemRepository = new ItemRepository(db)

type LambdaReturn = {
    stockInventory: {
        new: Devices
        used: Devices
        breakFix: Devices
        returned: Devices
    }
}

const countDevices = (
    items: Awaited<ReturnType<typeof itemRepository.getItemsWithDetails>>,
    status: string,
) => {
    return {
        mobile: items.reduce(
            (counter, item) =>
                item.status?.toLowerCase() === status &&
                item.deviceType?.toLowerCase() === 'mobile'
                    ? counter + 1
                    : counter,
            0,
        ),
        tablet: items.reduce(
            (counter, item) =>
                item.status?.toLowerCase() === status &&
                item.deviceType?.toLowerCase() === 'tablet'
                    ? counter + 1
                    : counter,
            0,
        ),
        laptop: items.reduce(
            (counter, item) =>
                item.status?.toLowerCase() === status &&
                item.deviceType?.toLowerCase() === 'laptop'
                    ? counter + 1
                    : counter,
            0,
        ),
    }
}

const items: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const items = await itemRepository.getItemsWithDetails()

    return {
        stockInventory: {
            new: countDevices(items, 'new'),
            used: countDevices(items, 'used'),
            breakFix: countDevices(items, 'break-fix'),
            returned: countDevices(items, 'returned'),
        },
    }
}

export const main = middyfy(items)
