import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { badRequest } from '@hapi/boom'
import { apiGatewayRoleProtection } from '@libs/middlewares/apiGatewayRoleProtection'
import { middyfy } from '@libs/middlewares/middyfy'
import getAuth0Instance from '@libs/utils/Auth0Instance'
import schema from './schema'

type LambdaReturn = { user_id: string }

const numberTypes = ['mobile', 'home', 'fax', 'work', 'direct']

const addUser: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    LambdaReturn
> = async (event) => {
    const { body } = event

    const Auth0Instance = await getAuth0Instance()

    if (
        !body.phone_numbers.every((number) => numberTypes.includes(number.type))
    ) {
        throw badRequest('Invalid number type')
    }

    const { data } = await Auth0Instance.createUser({
        ...body,
        status: body.status ? body.status : 'active',
        role: 'user',
    })

    return {
        user_id: data.user_id,
    }
}

export const main = middyfy(addUser).use(
    apiGatewayRoleProtection({ roles: ['superAdmin', 'manager'] }),
)
