import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { UserInfo } from '@declarations/db/userinfo'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { PeopleRepository } from '@libs/repositories/mysql/PeopleRepository'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)
const { AUTH0_CUSTOM_CLAIMS_NAMESPACE } = process.env
type LambdaReturn = {
    user: {
        people_id: number
        first_name: string
        last_name: string
        phone_number_mobile: string
        phone_number_home: string
        status: string
        business_unit: string
        position_title: string
        email_address_home: string
        email_address_work: string
        country_name: string
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
    const [dbUser] = await peopleRepository.getUserByEmail({
        email: auth0user.email,
    })
    const user = {
        ...dbUser,
        roles: auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/roles`],
        picture: auth0user.picture,
    }
    return {
        user,
    }
}

export const main = middyfy(me)
