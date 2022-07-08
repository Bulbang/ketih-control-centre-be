import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'

type LambdaReturn = {
    assets: {
        asset_tag: string
        asset_type: string
        model: string
        status: string
        warranty_date: string
        requests: string[]
    }[]
    total: number
}

const getAssets: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async () => {
    return {
        assets: [
            {
                asset_tag: 'dasdasd',
                asset_type: 'Laptop',
                model: 'MacBook',
                status: 'In-stock',
                warranty_date: '03/23/2023',
                requests: ['REQ12312', 'REQ12313'],
            },
            {
                asset_tag: 'asdad',
                asset_type: 'Tablet',
                model: 'IPad',
                status: 'Deployed',
                warranty_date: '03/23/2023',
                requests: ['REQ12212'],
            },
            {
                asset_tag: 'bbbbb',
                asset_type: 'Laptop',
                model: 'HP ZBook',
                status: 'Returned',
                warranty_date: '03/23/2023',
                requests: ['REQ12312', 'REQ12313', 'REQ12313'],
            },
        ],
        total: 228,
    }
}

export const main = middyfy(getAssets)
