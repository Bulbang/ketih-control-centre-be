import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'
import { mockDbCreds } from '@libs/utils/dbCredentials'

const getChangeLogs: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: mockDbCreds,
    events: [
        {
            http: {
                method: 'get',
                path: 'change-logs',
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

export default getChangeLogs
