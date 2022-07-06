import schema from './schema'
import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'
import { mockDbCreds } from '@libs/utils/dbCredentials'

const addUser: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: mockDbCreds,
    events: [
        {
            http: {
                method: 'post',
                path: 'users',
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

export default addUser
