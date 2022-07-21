import { UserInfo } from '@declarations/db/userinfo'
import { ActivityRepostiory } from '@libs/repositories/dynamoDb/ActivityRepository'
import { APIGatewayEventRequestContextWithAuthorizer } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const { ACTIVITY_TABLE_NAME } = process.env
const ddc = new DocumentClient()
const activityRepostiory = new ActivityRepostiory(ddc, ACTIVITY_TABLE_NAME)

export const writeActivity = (
    requestContext: APIGatewayEventRequestContextWithAuthorizer<{
        [name: string]: string
    }>,
    activityType: string,
    activityDetail: string,
) => {
    const user = JSON.parse(requestContext.authorizer.user) as UserInfo
    return activityRepostiory.writeActivity({
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
        picture: user.picture,
        type: activityType,
        activityDetail,
    })
}
