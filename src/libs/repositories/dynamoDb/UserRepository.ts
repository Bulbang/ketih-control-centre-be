import { UserInfo } from '@declarations/db/userinfo'
import AWS from 'aws-sdk'

export class UserRepository {
    constructor(
        private _ddc: AWS.DynamoDB.DocumentClient,
        private _tableName: string,
    ) {}

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

// DynamoRepository.save('eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtaDZwYWttZ2UudXMuYXV0aDAuY29tLyJ9..eup8J8DjP42wqtnU.vao9x0QMSY5KK-yZ3OAf9RHz5Xean-GSxq8g2zLOAi_ft7eoAU78vgUqDxn5JEzSuQ9zt6twkEBkSNWhUj77HS3BpCbU5mgdGVX3Hvo8iJJovT1gRIafo8BNgEIpkrIkXKsajlfI9DxFN4wdwv9UOZB41X-t_rf3KhMReF_SndPaj-fRqeMtrlZmr1USg0CK5Uaut4iqIGNN-6j8jUysjxYkb92Qkr_F4oKCI6iYfYu-gN8a8fyXuVquVo5WQUgb9Q5g_qjWX-kEo_O5dT3FVAVK7oqDVbT_318s4xF4dIHpyML15RCG2AK4QdrUCg_qu59jQX2-qw.udLVBIRadejfbJZc-uRVbg')
