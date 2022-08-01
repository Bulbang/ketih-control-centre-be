import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const tosSign: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: {
        AUTH0_URL: '${env:AUTH0_URL}',
        AUTH0_CLIENT_SECRET: '${env:AUTH0_CLIENT_SECRET}',
        AUTH0_CLIENT_ID: '${env:AUTH0_CLIENT_ID}',
        TABLE_NAME: { Ref: 'UsersTable' },
    },
    events: [
        {
            http: {
                method: 'post',
                path: 'me/tos-sign',
                authorizer: {
                    type: 'token',
                    name: 'auth',
                    identitySource: 'method.request.header.Authorization',
                    resultTtlInSeconds: 0,
                },
                cors: true,
            },
        },
    ],
}

export default tosSign
