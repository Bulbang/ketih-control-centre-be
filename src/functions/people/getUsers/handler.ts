import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import Auth0Instance from '@libs/utils/Auth0Instance'

type LambdaReturn = {
    users: {
        user_id: string
        first_name: string
        last_name: string
        phone_number_mobile: string
        status: string
        business_unit: string
        email_address_work: string
        country_name: string
        roles: string[]
    }[]
}

const getUsers: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage } = event.queryStringParameters as {
        page?: number
        perPage?: number
    }
    await Auth0Instance.updateToken()
    const users = await Auth0Instance.getUsers({
        page,
        perPage,
    })
    return {
        users: users.map((user) => {
            return {
                user_id: user.user_id,
                email_address_work: user.email,
                first_name: user.given_name,
                last_name: user.family_name,
                phone_number_mobile: user.user_metadata?.phone_number_mobile,
                status: user.user_metadata?.status,
                business_unit: user.user_metadata?.business_unit,
                country_name: user.user_metadata?.country,
                roles: user.app_metadata.roles,
            }
        }),
    }
}

export const main = middyfy(getUsers)
