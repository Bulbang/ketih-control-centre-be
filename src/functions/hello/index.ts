import schema from './schema'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const hello: LambdaConfig = {
    handler: `${handlerPath(__dirname)}/handler.main`,
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
            },
        },
    ],
}

export default hello
