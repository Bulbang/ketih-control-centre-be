import schema from './schema'
import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const editUser: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
    environment: {
        MYSQLUSER: '${env:MYSQLUSER}',
        MYSQLPASSWORD: '${env:MYSQLPASSWORD}',
        MYSQL_URL: '${env:MYSQL_URL}',
        MYSQLPORT: '${env:MYSQLPORT}',
        MYSQLHOST: '${env:MYSQLHOST}',
        MYSQLDATABASE: '${env:MYSQLDATABASE}',
    },
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
