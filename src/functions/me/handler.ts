import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { UserInfo } from '@declarations/db/userinfo'

const { AUTH0_CUSTOM_CLAIMS_NAMESPACE } = process.env
type LambdaReturn = {
    user: {
        user_id: string
        first_name: string
        last_name: string
        phone_number_mobile: string
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

    const user = {
        user_id: auth0user.sub,
        first_name: auth0user.given_name,
        last_name: auth0user.family_name,
        phone_number_mobile:
            auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]
                ?.phone_number_mobile,
        status: auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]
            ?.status,
        business_unit:
            auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]
                ?.business_unit,
        country:
            auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]
                ?.country,
        email: auth0user.email,
        roles: auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/roles`]
            ? auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/roles`]
            : [],
        picture: auth0user.picture,
    }
    return {
        user,
    }
}

export const main = middyfy(me)
