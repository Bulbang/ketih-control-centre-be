import { AwsResources } from './src/types/aws/resources'
const resources: AwsResources = {
    Resources: {
        UsersTable: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                TableName: '${self:custom.prefix}-users-table',
                BillingMode: 'PAY_PER_REQUEST',
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' },
                    // { AttributeName: 'accessToken', AttributeType: 'S' },
                ],
                KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
            },
        },
    },
}

export {resources as default}