import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { badRequest } from '@hapi/boom'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'
import { ItemDetailRepository } from '@libs/repositories/mysql/ItemDetailRepository'

const db = createDbConnection()
const itemDetailRepository = new ItemDetailRepository(db)
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    assets: {
        asset_tag: string
        asset_type: string
        model: string
        status: string
        warranty_date: string
        requests: { request_id: number }[]
    }[]
}

const getAssets: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage, sortBy, direction, interval } =
        event.queryStringParameters as {
            interval?: string
            page?: string
            perPage?: string
            sortBy?: string
            direction?: 'asc' | 'desc'
        }

    if (direction && direction != 'asc' && direction != 'desc') {
        throw badRequest(`Unknown sort direction parameter: '${direction}'`)
    }
    try {
        const assets = await itemDetailRepository.getAssets({
            last: interval ? +interval : undefined,
            perPage: perPage ? +perPage : undefined,
            page: page ? +page : undefined,
            sortBy,
            direction,
        })

        const associatedRequests =
            await workOrderRepository.getAssociatedRequestsToAsset(
                assets.map((asset) => asset.serial_number),
            )
        return {
            assets: assets.map((asset) => {
                const [associatedRequest] = associatedRequests
                    .filter((req) => req.serial_number == asset.serial_number)
                    .map((req) => req.requests)
                asset.serial_number = undefined
                const newAsset: {
                    asset_tag: string
                    asset_type: string
                    model: string
                    status: string
                    warranty_date: string
                    requests: { request_id: number }[]
                } = {
                    ...asset,
                    requests: associatedRequest ? associatedRequest : [],
                }
                return newAsset
            }),
        }
    } catch (error) {
        throw error.message == `Unknown column '${sortBy}' in 'order clause'`
            ? badRequest(`Unknown sortBy parameter: '${sortBy}'`)
            : error
    }
}

export const main = middyfy(getAssets)
