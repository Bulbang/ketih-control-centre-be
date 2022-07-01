import { handlerPath } from '@libs/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const auth: LambdaConfig = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    environment: {
        TABLE_NAME: { Ref: 'UsersTable' },
        AUTH0_URL: '${env:AUTH0_URL}',
    },
}

export default auth
