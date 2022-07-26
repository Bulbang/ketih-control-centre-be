import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { ItemDetailRepository } from '@libs/repositories/mysql/ItemDetailRepository'

const db = createDbConnection()
const itemDetailRepository = new ItemDetailRepository(db)

type LambdaReturn = { total: number }

const getAssetsTotal: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const [{ total }] =
        (await itemDetailRepository.getAssetsTotal()) as unknown as {
            total: number
        }[]
    return { total }
}

export const main = middyfy(getAssetsTotal)
