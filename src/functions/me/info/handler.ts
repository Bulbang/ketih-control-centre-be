import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { UserInfo } from '@declarations/db/userinfo'

const ifUndefinedThenFallback = (str: string) => {
    return str ? str : 'Fallback'
}

const { AUTH0_CUSTOM_CLAIMS_NAMESPACE } = process.env
type LambdaReturn = {
    user: {
        user_id: string
        first_name: string
        last_name: string
        phone_numbers:
            | string
            | {
                  phone: string
                  type: string
              }[]
        // phone_number_home: string
        status: string
        business_unit: string
        // position_title: string
        // email_address_home: string
        email: string
        country: string
        roles: string[]
        picture: string
    }
}

const me: ValidatedEventAPIGatewayProxyEvent<undefined, LambdaReturn> = async (
    event,
) => {
    const auth0user = JSON.parse(
        event.requestContext.authorizer.user,
    ) as UserInfo

    const phone_numbers = auth0user[
        `${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`
    ]?.phone_number_mobile
        ? auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]
              ?.phone_number_mobile
        : auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]
              ?.phone_numbers

    const user = {
        user_id: ifUndefinedThenFallback(auth0user.sub),
        first_name: ifUndefinedThenFallback(auth0user.given_name),
        last_name: ifUndefinedThenFallback(auth0user.family_name),
        phone_numbers: phone_numbers.length ? phone_numbers : [],

        status: ifUndefinedThenFallback(
            auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]?.status,
        ),
        business_unit: ifUndefinedThenFallback(
            auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]
                ?.business_unit,
        ),
        country: ifUndefinedThenFallback(
            auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]
                ?.country,
        ),
        email: ifUndefinedThenFallback(auth0user.email),
        roles: auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/roles`]
            ? auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/roles`]
            : [],
        picture: ifUndefinedThenFallback(auth0user.picture),
        tos_signed:
            auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]
                ?.tos_signed,
    }
    return {
        user,
    }
}

export const main = middyfy(me)
