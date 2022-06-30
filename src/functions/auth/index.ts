import { handlerPath } from '@libs/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const auth: LambdaConfig = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    environment: {
        TABLE_NAME: { Ref: 'UsersTable' },
    },
}

export default auth
