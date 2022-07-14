import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { ActivityRepostiory } from '@libs/repositories/dynamoDb/ActivityRepository'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UserActivity } from '@declarations/db/userActivity'

const { ACTIVITY_TABLE_NAME } = process.env
const ddc = new DocumentClient()
const activityRepostiory = new ActivityRepostiory(ddc, ACTIVITY_TABLE_NAME)

type LambdaReturn = UserActivity[]

const getActivities: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const [activities] = await activityRepostiory.getActivities()

    return activities as UserActivity[]
}

export const main = middyfy(getActivities)
