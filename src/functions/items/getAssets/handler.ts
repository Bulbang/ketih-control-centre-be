import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { badRequest } from '@hapi/boom'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    assets: {
        asset_tag: string
        asset_type: string
        model: string
        status: string
        warranty_date: string
        requests: { request_id: string }[]
    }[]
}

const getAssets: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage, sortBy, direction } =
        event.queryStringParameters as {
            page?: string
            perPage?: string
            sortBy?: string
            direction?: 'asc' | 'desc'
        }

    if (direction && direction != 'asc' && direction != 'desc') {
        throw badRequest(`Unknown sort direction parameter: '${direction}'`)
    }
    try {
        const assets = await workOrderRepository.getAssets({
            perPage: perPage ? +perPage : undefined,
            page: page ? +page : undefined,
            sortBy,
            direction,
        })

        return {
            assets: assets.map((asset) => {
                asset.requests = [
                    { request_id: Math.round(Math.random() * 1000) },
                ]
                return asset
            }),
        }
    } catch (error) {
        throw error.message == `Unknown column '${sortBy}' in 'order clause'`
            ? badRequest(`Unknown sortBy parameter: '${sortBy}'`)
            : error
    }
}

export const main = middyfy(getAssets)
