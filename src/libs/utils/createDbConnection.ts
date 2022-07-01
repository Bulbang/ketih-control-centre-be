import { Database } from 'aws-sdk/clients/cloudwatchevents'
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

const { MYSQLUSER, MYSQLPASSWORD, MYSQLPORT, MYSQLHOST, MYSQLDATABASE } =
    process.env

export const createDbConnection = () => {
    const db = new Kysely<Database>({
        dialect: new MysqlDialect({
            pool: createPool({
                database: MYSQLDATABASE,
                host: MYSQLHOST,
                password: MYSQLPASSWORD,
                user: MYSQLUSER,
                port: +MYSQLPORT,
            }),
        }),
    })
    return db
}
