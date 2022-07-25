import schema from './schema'
import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const meUpdate: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: {},
    events: [
        {
            http: {
                method: 'put',
                path: 'me/update',
                request: {
                    schemas: {
                        'application/json': schema,
                    },
                },
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

export default meUpdate
