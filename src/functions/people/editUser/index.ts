import schema from './schema'
import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'
import { dbCredentials } from '@libs/utils/dbCredentials'

const editUser: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: dbCredentials,
    events: [
        {
            http: {
                method: 'put',
                path: 'users/{id}',
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

export default editUser
