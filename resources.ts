import { AwsResources } from './src/types/aws/resources'
const resources: AwsResources = {
    Parameters: { DataGSI1IndexName: { Type: 'String', Default: 'gsi-1' } },
    Resources: {
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
