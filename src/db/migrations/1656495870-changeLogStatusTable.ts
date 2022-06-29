import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('change_log_status')
        .ifNotExists()
        .addColumn('change_log_status_id', 'integer', (col) =>
            col.primaryKey().autoIncrement(),
        )
        .addColumn('change_log_status_name', 'varchar(100)', (col) =>
            col.notNull(),
        )
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('change_log_status').execute()
}
