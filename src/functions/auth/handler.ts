import {
    APIGatewayTokenAuthorizerHandler,
    AuthResponse,
    PolicyDocument,
} from 'aws-lambda'
import { DynamoRepository } from '@libs/repositories/DynamoRepository'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getUserInfo } from '@libs/utils/getUserinfo'

const dc = new DocumentClient()
const { TABLE_NAME } = process.env
const dynamoRepository = new DynamoRepository(dc, TABLE_NAME)

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

    const user = await dynamoRepository.findByToken(authToken)

    // If authToken don`t extist (or expired) we will record userData from auth0 by new authToken
    if (!user) {
        try {
            const userData = await getUserInfo(authToken)
            await dynamoRepository.save(authToken, userData)
        } catch (error) {
            console.log(error.toString())
            callback('Unauthorized')
        }
    }
    callback(null, generatePolicy('user', 'Allow', event.methodArn))

    return null
}

export const main = handler
