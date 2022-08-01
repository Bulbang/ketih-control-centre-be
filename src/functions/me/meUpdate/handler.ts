import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import schema from './schema'
import { UserInfo } from '@declarations/db/userinfo'
import { badRequest } from '@hapi/boom'
import getAuth0Instance from '@libs/utils/Auth0Instance'

type LambdaReturn = void

const meUpdate: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    LambdaReturn
> = async (event) => {
    const { body } = event

    if (body.email && body.password)
        throw badRequest("Can't update password and email at the same time")

    if (
        (body.first_name && !body.last_name) ||
        (!body.first_name && body.last_name)
    )
        throw badRequest("Cant't update name without first or second name")

    const user = event.requestContext.authorizer as UserInfo
    const Auth0Instance = await getAuth0Instance()
    await Auth0Instance.updateUser(user.sub, body)
}

export const main = middyfy(meUpdate)
