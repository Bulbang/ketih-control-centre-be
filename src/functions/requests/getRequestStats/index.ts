import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'
import { dbCreds } from '@libs/utils/dbCredentials'

const getRequestStats: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: dbCreds,
    events: [
        {
            http: {
                method: 'get',
                path: 'requests/statistic',
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

export default getRequestStats
