import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { ItemDetailRepository } from '@libs/repositories/mysql/ItemDetailRepository'

const db = createDbConnection()
const itemDetailRepository = new ItemDetailRepository(db)

type LambdaReturn = {
    total: number
    topAssets: { manufacturer: string; model: string; total: unknown }[]
    other: number
}

const getAssetsByMake: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const assetsStats = await itemDetailRepository.getAssetsByMake()
    const total = assetsStats.reduce((counter, asset) => {
        const totalByMake = asset.total as number
        return totalByMake + counter
    }, 0)
    const topAssets = assetsStats.splice(0, 10)
    const other =
        total -
        topAssets.reduce((counter, asset) => {
            const totalByMake = asset.total as number
            return totalByMake + counter
        }, 0)

    return {
        total,
        topAssets,
        other,
    }
}

export const main = middyfy(getAssetsByMake)
