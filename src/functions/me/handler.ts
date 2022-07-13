import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { UserInfo } from '@declarations/db/userinfo'

type LambdaReturn = {
    user: UserInfo
}

const me: ValidatedEventAPIGatewayProxyEvent<undefined, LambdaReturn> = async (
    event,
) => {
    const user = JSON.parse(event.requestContext.authorizer.user) as UserInfo
    return {
        user,
    }
}

export const main = middyfy(me)
