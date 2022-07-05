import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'
import { dbCredentials } from '@libs/utils/dbCredentials'

const requests: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: dbCredentials,
    events: [
        {
            http: {
                method: 'get',
                path: 'requests',
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

export default requests
