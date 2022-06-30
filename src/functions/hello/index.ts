import schema from './schema'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const hello: LambdaConfig = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    environment: {
        TABLE_NAME: { Ref: 'UsersTable' },
    },
    events: [
        {
            http: {
                method: 'post',
                path: 'hello',
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

export default hello
