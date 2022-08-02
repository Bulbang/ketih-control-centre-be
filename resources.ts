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
        ClientBrandingBucket: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: '${self:custom.brandingBucketName}',
                AccessControl: 'PublicReadWrite',
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: false,
                    BlockPublicPolicy: false,
                    IgnorePublicAcls: false,
                    RestrictPublicBuckets: false,
                },
                CorsConfiguration: {
                    CorsRules: [
                        {
                            AllowedMethods: ['GET', 'POST'],
                            AllowedOrigins: ['*'],
                        },
                    ],
                },
            },
        },
    },
}

export { resources as default }
