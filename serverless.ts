import type { AWS } from '@serverless/typescript'

import * as functions from '@functions/index'
import resources from './resources'

const serverlessConfiguration: AWS = {
    useDotenv: true,
    service: 'keith-control-centre-be',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        stage: '${opt:stage, "dev"}',
        name: 'aws',
        runtime: 'nodejs14.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    'dynamodb:PutItem',
                    'dynamodb:Query',
                    'dynamodb:DeleteItem',
                ],
                Resource: [{ 'Fn::GetAtt': ['UsersTable', 'Arn'] }],
            },
            {
                Effect: 'Allow',
                Action: ['dynamodb:PutItem', 'dynamodb:Query', 'dynamodb:Scan'],
                Resource: [{ 'Fn::GetAtt': ['ActivityTable', 'Arn'] }],
            },
            {
                Effect: 'Allow',
                Action: ['s3:*'],
                Resource: [
                    {
                        'Fn::Join': [
                            '/',
                            [{ 'Fn::GetAtt': 'ClientBrandingBucket.Arn' }, '*'],
                        ],
                    },
                ],
            },
        ],
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            DEFAULT_PAGE_OFFSET: '10',
            AUTH0_CUSTOM_CLAIMS_NAMESPACE:
                '${env:AUTH0_CUSTOM_CLAIMS_NAMESPACE}',
            ACTIVITY_TABLE_NAME: { Ref: 'ActivityTable' },
        },
    },

    // import the function via paths
    functions,
    resources,
    package: { individually: true },
    custom: {
        prefix: '${self:service}-${self:provider.stage}',
        brandingBucketName: '${self:custom.prefix}-branding-bucket',
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
}

module.exports = serverlessConfiguration
