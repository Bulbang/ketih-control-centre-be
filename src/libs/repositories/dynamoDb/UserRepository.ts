import { UserInfo } from '@declarations/db/userinfo'
import { DynamoDbRepository } from './DynamoDbRepository'

export class UserRepository extends DynamoDbRepository {
    findByToken = async (accessToken: string) => {
        const { Items, Count } = await this._ddc
            .query({
                TableName: this._tableName,
                KeyConditionExpression: 'accessToken = :accessToken',
                ExpressionAttributeValues: {
                    ':accessToken': accessToken,
                },
            })
            .promise()

        return Count ? Items[0] : undefined
    }
    save = async (accessToken: string, userData: UserInfo) => {
        return this._ddc
            .put({
                TableName: this._tableName,
                Item: {
                    accessToken,
                    ...userData,
                    createdAt: +new Date(),
                },
            })
            .promise()
    }
}
