#!/usr/bin/env sh
 
lambda_name=$2
path=$1

mkdir "$path/$lambda_name"
touch "$path/$lambda_name/index.ts"
touch "$path/$lambda_name/handler.ts"
echo "import { middyfy } from '@libs/middlewares/middyfy'
import { APIGatewayProxyHandler } from 'aws-lambda'


const $lambda_name: APIGatewayProxyHandler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify('hello in $lambda_name')
    }
}

export const main = middyfy($lambda_name)
" > $path/$lambda_name/handler.ts
echo "import schema from './schema'
import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const $lambda_name: LambdaConfig = {
    handler: handlerPath(__dirname) + \"/handler.main\",
    environment: {  },
    events: [
        {
            http: {
                method: 'get',
                path: '$lambda_name',
                //request: {
                //    schemas: {
                //       'application/json': schema,
                //    },
                //},
                //authorizer: {
                //    type: 'token',
                //    name: 'auth',
                //    identitySource: 'method.request.header.Authorization',
                //    resultTtlInSeconds: 0,
                //},
                cors: true,
            },
        },
    ],
}

export default $lambda_name
" > $path/$lambda_name/index.ts

echo "
export { default as $lambda_name } from \"./$lambda_name\"" >> ./src/functions/index.ts