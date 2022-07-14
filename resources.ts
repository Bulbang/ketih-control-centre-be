import { AwsResources } from './src/types/aws/resources'
const resources: AwsResources = {
    Resources: {
        ActivityTable: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                TableName: '${self:custom.prefix}-activity-table',
                BillingMode: 'PAY_PER_REQUEST',
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' },
                ],
                KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
            },
        },
        UsersTable: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                TableName: '${self:custom.prefix}-tokens-table',
                BillingMode: 'PAY_PER_REQUEST',
                AttributeDefinitions: [
                    { AttributeName: 'accessToken', AttributeType: 'S' },
                ],
                KeySchema: [{ AttributeName: 'accessToken', KeyType: 'HASH' }],
            },
        },
    },
}

export { resources as default }
