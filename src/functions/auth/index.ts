import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const auth: LambdaConfig = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    environment: {
        TABLE_NAME: { Ref: 'UsersTable' },
        AUTH0_URL: '${env:AUTH0_URL}',
        AUTH0_DOMAIN: '${env:AUTH0_DOMAIN}',
        AUTH0_CLIENT_SECRET: '${env:AUTH0_CLIENT_SECRET}',
        AUTH0_CLIENT_ID: '${env:AUTH0_CLIENT_ID}',
    },
}

export default auth
