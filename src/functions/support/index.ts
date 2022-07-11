import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const getSupport: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: {},
    events: [
        {
            http: {
                method: 'get',
                path: 'support',
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

export default getSupport
