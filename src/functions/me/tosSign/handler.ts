import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import getAuth0Instance from '@libs/utils/Auth0Instance'
import { UserInfo } from '@declarations/db/userinfo'
import { badRequest } from '@hapi/boom'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UserRepository } from '@libs/repositories/dynamoDb/UserRepository'

const { AUTH0_CUSTOM_CLAIMS_NAMESPACE } = process.env

const ddc = new DocumentClient()
const { TABLE_NAME } = process.env
const userRepository = new UserRepository(ddc, TABLE_NAME)

const tosSign: ValidatedEventAPIGatewayProxyEvent<undefined, void> = async (
    event,
) => {
    const auth0user = JSON.parse(
        event.requestContext.authorizer.user,
    ) as UserInfo
    const { authToken } = event.requestContext.authorizer
    if (
        auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`]?.tos_signed
    ) {
        throw badRequest('ToS already signed by that user')
    }

    const Auth0Instance = await getAuth0Instance()

    await Auth0Instance.updateUser(auth0user.sub, { tos_signed: true })

    auth0user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/user_metadata`].tos_signed =
        true

    await userRepository.dropSession(authToken)
    await userRepository.save(authToken, auth0user)
}

export const main = middyfy(tosSign)
