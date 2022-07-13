import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const me: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: {},
    events: [
        {
            http: {
                method: 'get',
                path: 'me',
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

export default me
