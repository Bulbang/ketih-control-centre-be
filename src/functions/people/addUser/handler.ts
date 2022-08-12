import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { apiGatewayRoleProtection } from '@libs/middlewares/apiGatewayRoleProtection'
import { middyfy } from '@libs/middlewares/middyfy'
import getAuth0Instance from '@libs/utils/Auth0Instance'
import schema from './schema'

type LambdaReturn = { user_id: string }

const addUser: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    LambdaReturn
> = async (event) => {
    const { body } = event

    const Auth0Instance = await getAuth0Instance()

    const { data } = await Auth0Instance.createUser({ ...body, role: 'user' })

    return {
        user_id: data.user_id,
    }
}

export const main = middyfy(addUser).use(
    apiGatewayRoleProtection({ roles: ['superAdmin', 'manager'] }),
)
