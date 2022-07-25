import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { badRequest } from '@hapi/boom'
import { apiGatewayRoleProtection } from '@libs/middlewares/apiGatewayRoleProtection'
import { middyfy } from '@libs/middlewares/middyfy'
import Auth0Instance from '@libs/utils/Auth0Instance'
import schema from './schema'

const editUser: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    void
> = async (event) => {
    const { body } = event
    const { id } = event.pathParameters

    if (body.email && body.password)
        throw badRequest("Can't update password and email at the same time")

    if (
        (body.first_name && !body.last_name) ||
        (!body.first_name && body.last_name)
    )
        throw badRequest("Cant't update name without first or second name")

    await Auth0Instance.updateToken()
    await Auth0Instance.updateUser(id, body)
}

export const main = middyfy(editUser).use(
    apiGatewayRoleProtection({ roles: ['superAdmin', 'manager'] }),
)
