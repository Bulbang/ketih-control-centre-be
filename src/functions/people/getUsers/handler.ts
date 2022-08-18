import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import getAuth0Instance from '@libs/utils/Auth0Instance'

const ifUndefinedThenFallback = (str: string) => {
    return str ? str : 'Fallback'
}

type LambdaReturn = {
    users: {
        user_id: string
        first_name: string
        last_name: string
        phone_numbers: any
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
> = async ({ queryStringParameters }) => {
    const { page, perPage } = queryStringParameters as {
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
            const phone_numbers = user.user_metadata?.phone_number_mobile
                ? user.user_metadata?.phone_number_mobile
                : user.user_metadata?.phone_numbers
            return {
                user_id: ifUndefinedThenFallback(user.user_id),
                email: ifUndefinedThenFallback(user.email),
                first_name: ifUndefinedThenFallback(user.given_name),
                last_name: ifUndefinedThenFallback(user.family_name),
                picture: ifUndefinedThenFallback(user.picture),
                phone_numbers: phone_numbers?.length ? phone_numbers : [],
                status: ifUndefinedThenFallback(user.user_metadata?.status),
                business_unit: ifUndefinedThenFallback(
                    user.user_metadata?.business_unit,
                ),
                country: ifUndefinedThenFallback(user.user_metadata?.country),
                roles: user.app_metadata?.roles ? user.app_metadata?.roles : [],
            }
        }),
    }
}

export const main = middyfy(getUsers)
