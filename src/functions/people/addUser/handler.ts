import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { apiGatewayRoleProtection } from '@libs/middlewares/apiGatewayRoleProtection'
import { middyfy } from '@libs/middlewares/middyfy'
import Auth0Instance from '@libs/utils/Auth0Instance'
import schema from './schema'

const addUser: ValidatedEventAPIGatewayProxyEvent<typeof schema, void> = async (
    event,
) => {
    const { body } = event
    await Auth0Instance.updateToken()
    await Auth0Instance.createUser({ ...body, role: 'user' })
}

export const main = middyfy(addUser).use(
    apiGatewayRoleProtection({ roles: ['superAdmin', 'manager'] }),
)
