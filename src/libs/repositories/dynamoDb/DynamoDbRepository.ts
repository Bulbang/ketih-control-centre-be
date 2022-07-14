import AWS from 'aws-sdk'

export class DynamoDbRepository {
    constructor(
        protected _ddc: AWS.DynamoDB.DocumentClient,
        protected _tableName: string,
    ) {}
}
