import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const getAssetsByType: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: {},
    events: [
        {
            http: {
                method: 'get',
                path: 'items/assets/by-type',
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

export default getAssetsByType
