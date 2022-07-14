import { UserActivity } from '@declarations/db/userActivity'
import { DynamoDbRepository } from './DynamoDbRepository'
import { v4 } from 'uuid'

export class ActivityRepostiory extends DynamoDbRepository {
    writeActivity = async ({
        firstName,
        lastName,
        email,
        activityDetail,
    }: {
        firstName: string
        lastName: string
        email: string
        activityDetail: string
    }) => {
        const activity: UserActivity = {
            id: v4(),
            user_first_name: firstName,
            user_last_name: lastName,
            user_email: email,
            activity: activityDetail,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }
        return this._ddc
            .put({ TableName: this._tableName, Item: activity })
            .promise()
    }

    getActivities = async () => {
        const { Items, Count } = await this._ddc
            .scan({
                TableName: this._tableName,
            })
            .promise()

        return [Items, Count]
    }
}
