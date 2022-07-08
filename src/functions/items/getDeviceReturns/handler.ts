import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'

type LambdaReturn = {
    total: number
    recieved_by_atnt: number
    in_transit: number
    not_shipped_by_employee: number
}

const getDeviceReturns: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const data = {
        recieved_by_atnt: Math.round(Math.random() * 10000),
        in_transit: Math.round(Math.random() * 10000),
        not_shipped_by_employee: Math.round(Math.random() * 10000),
    }
    return {
        total:
            data.in_transit +
            data.not_shipped_by_employee +
            data.recieved_by_atnt,
        ...data,
    }
}

export const main = middyfy(getDeviceReturns)
