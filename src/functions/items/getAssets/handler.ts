import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { ItemDetailRepository } from '@libs/repositories/mysql/ItemDetailRepository'
import { badRequest } from '@hapi/boom'

const db = createDbConnection()
const itemDetailRepository = new ItemDetailRepository(db)

type LambdaReturn = {
    assets: {
        asset_tag: string
        asset_type: string
        model: string
        status: string
        warranty_date: string
        requests: string[]
    }[]
}

const getAssets: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage, sortBy, direction } =
        event.queryStringParameters as {
            page?: number
            perPage?: number
            sortBy?: string
            direction?: 'asc' | 'desc'
        }

    if (direction && direction != 'asc' && direction != 'desc') {
        throw badRequest(`Unknown sort direction parameter: '${direction}'`)
    }
    try {
        const assets = await itemDetailRepository.getAssets({
            page,
            perPage,
            sortBy,
            direction,
        })

        return {
            assets: assets.map((asset) => {
                return {
                    ...asset,
                    requests: [`REQ${Math.round(Math.random() * 8999) + 1000}`],
                }
            }),
        }
    } catch (error) {
        throw error.message == `Unknown column '${sortBy}' in 'order clause'`
            ? badRequest(`Unknown sortBy parameter: '${sortBy}'`)
            : error
    }
}

export const main = middyfy(getAssets)
