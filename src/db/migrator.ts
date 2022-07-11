import { Database } from '@declarations/db/tables'
import { FileMigrationProvider, Kysely, Migrator, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import { promises } from 'fs'
import { join } from 'path'

const db = new Kysely<Database>({
    dialect: new MysqlDialect({
        pool: createPool({
            database: 'railway',
            host: 'containers-us-west-66.railway.app',
            password: 'kfwawsFcfnmVllFKJ0n4',
            user: 'root',
            port: 7853,
        }),
    }),
})
const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs: promises,
        path: { join },
        migrationFolder: './src/db/migrations/dump',
    }),
})

export const migrateToLatest = async () => {
    const { error, results } = await migrator.migrateToLatest()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(
                `Migration "${it.migrationName}" was executed successfully`,
            )
        } else if (it.status === 'Error') {
            console.error(`Failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('Failed to migrate')
        console.error(error)
        process.exit(1)
    }

    await db.destroy()
}

export const migrateUp = async () => {
    const { error, results } = await migrator.migrateUp()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(
                `Migration up "${it.migrationName}" was executed successfully`,
            )
        } else if (it.status === 'Error') {
            console.error(`Failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('Failed to migrate')
        console.error(error)
        process.exit(1)
    }

    await db.destroy()
}

export const migrateDown = async () => {
    const { error, results } = await migrator.migrateDown()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(
                `Migration down "${it.migrationName}" was executed successfully`,
            )
        } else if (it.status === 'Error') {
            console.error(`Failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('Failed to migrate')
        console.error(error)
        process.exit(1)
    }

    await db.destroy()
}
