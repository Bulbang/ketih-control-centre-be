import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'

type LambdaReturn = {
    total: number
    deployed: number
    in_stock: number
    returned: number
    quarantined: number
}

const getAssetsByType: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const data = {
        deployed: Math.round(Math.random() * 10000),
        in_stock: Math.round(Math.random() * 10000),
        returned: Math.round(Math.random() * 10000),
        quarantined: Math.round(Math.random() * 10000),
    }

    return {
        total: data.deployed + data.in_stock + data.quarantined + data.returned,
        ...data,
    }
}

export const main = middyfy(getAssetsByType)
