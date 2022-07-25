import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import Auth0Instance from '@libs/utils/Auth0Instance'
import schema from './schema'
import { badRequest } from '@hapi/boom'
import { apiGatewayRoleProtection } from '@libs/middlewares/apiGatewayRoleProtection'

type LambdaReturn = void

const editRole: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    LambdaReturn
> = async (event) => {
    const { id } = event.pathParameters
    const { role } = event.body

    if (
        role.toLowerCase() != 'manager' &&
        role.toLowerCase() != 'superadmin' &&
        role.toLowerCase() != 'user'
    )
        throw badRequest(`Unknown role ${role}`)

    await Auth0Instance.updateToken()
    await Auth0Instance.updateUser(id, { role })
}

export const main = middyfy(editRole).use(
    apiGatewayRoleProtection({ roles: ['superAdmin'] }),
)
