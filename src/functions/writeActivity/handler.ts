import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { ActivityRepostiory } from '@libs/repositories/dynamoDb/ActivityRepository'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const { ACTIVITY_TABLE_NAME } = process.env
const ddc = new DocumentClient()
const activityRepository = new ActivityRepostiory(ddc, ACTIVITY_TABLE_NAME)

type LambdaReturn = void

const writeActivity: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    console.log(JSON.stringify(event))
    await activityRepository.writeActivity({
        firstName: 'Bohdan',
        lastName: 'Tkachuk',
        email: 'tkachuk.b.s@gmail.com',
        activityDetail: 'TEST TEST TEST',
    })
}

export const main = writeActivity
