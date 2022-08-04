import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import getAuth0Instance from '@libs/utils/Auth0Instance'

type LambdaReturn = {
    users: {
        user_id: string
        first_name: string
        last_name: string
        phone_number_mobile: string
        picture: string
        status: string
        business_unit: string
        email: string
        country: string
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
    const Auth0Instance = await getAuth0Instance()
    const users = await Auth0Instance.getUsers({
        page,
        perPage,
    })
    return {
        users: users.map((user) => {
            return {
                user_id: user.user_id,
                email: user.email,
                first_name: user.given_name,
                last_name: user.family_name,
                picture: user.picture,
                phone_number_mobile: user.user_metadata?.phone_number_mobile,
                status: user.user_metadata?.status,
                business_unit: user.user_metadata?.business_unit,
                country: user.user_metadata?.country,
                roles: user.app_metadata?.roles,
            }
        }),
    }
}

export const main = middyfy(getUsers)
