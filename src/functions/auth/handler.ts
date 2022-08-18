import {
    APIGatewayTokenAuthorizerHandler,
    AuthResponse,
    PolicyDocument,
} from 'aws-lambda'
import { UserRepository } from '@libs/repositories/dynamoDb/UserRepository'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getUserInfo } from '@libs/utils/getUserinfo'
import { UserInfo } from '@declarations/db/userinfo'
import getAuth0Instance from '@libs/utils/Auth0Instance'

const dc = new DocumentClient()
const { TABLE_NAME, AUTH0_URL } = process.env
const dynamoRepository = new UserRepository(dc, TABLE_NAME)

const generatePolicy = (
    principalId: string,
    effect: string,
    resource: string,
) => {
    const policyDocument: PolicyDocument = {
        Version: '2012-10-17',
        Statement: [],
    }
    policyDocument.Statement[0] = {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
    }
    const authResponse: AuthResponse = {
        principalId,
        policyDocument,
    }
    return authResponse
}

const handler: APIGatewayTokenAuthorizerHandler = async (
    event,
    _context,
    callback,
) => {
    const [authToken] = event.authorizationToken.split(' ').reverse()
    const auth0 = await getAuth0Instance()
    let user = (await dynamoRepository.findByToken(authToken)) as UserInfo

    // If authToken don`t extist (or expired) we will record userData from auth0 by new authToken
    if (!user) {
        try {
            user = await getUserInfo(authToken, AUTH0_URL)
            const userOrgs = await auth0.listUserOrgs(user.sub)
            await dynamoRepository.save(authToken, { ...user, orgs: userOrgs })
        } catch (error) {
            console.log(error.toString())
            callback('Unauthorized')
        }
    }
    callback(null, {
        ...generatePolicy('user', 'Allow', event.methodArn),
        context: { user: JSON.stringify(user), authToken },
    })

    return null
}

export const main = handler
