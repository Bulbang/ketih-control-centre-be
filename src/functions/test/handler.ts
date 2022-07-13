import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { apiGatewayRoleProtection } from '@libs/middlewares/apiGatewayRoleProtection'

type LambdaReturn = {
    [name: string]: any
}

const test: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    return event.requestContext
}

export const main = middyfy(test).use(
    apiGatewayRoleProtection({ roles: ['asd'] }),
)
