import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { badRequest } from '@hapi/boom'
import { apiGatewayRoleProtection } from '@libs/middlewares/apiGatewayRoleProtection'
import { middyfy } from '@libs/middlewares/middyfy'
import getAuth0Instance from '@libs/utils/Auth0Instance'
import schema from './schema'

const numberTypes = ['mobile', 'home', 'fax', 'work', 'direct']

const editUser: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    void
> = async (event) => {
    const { body } = event
    const { id } = event.pathParameters

    if (!Object.keys(body).length) throw badRequest('No data to update')

    if (body.email && body.password)
        throw badRequest("Can't update password and email at the same time")

    if (
        (body.first_name && !body.last_name) ||
        (!body.first_name && body.last_name)
    )
        throw badRequest("Cant't update name without first or second name")

    if (
        !body.phone_numbers.every((number) => numberTypes.includes(number.type))
    ) {
        throw badRequest('Invalid number type')
    }

    const Auth0Instance = await getAuth0Instance()
    await Auth0Instance.updateUser(id, body)
}

export const main = middyfy(editUser).use(
    apiGatewayRoleProtection({ roles: ['superAdmin', 'manager'] }),
)
