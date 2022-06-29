import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('change_log')
        .ifNotExists()
        .addColumn('change_log_id', 'integer', (col) =>
            col.primaryKey().autoIncrement(),
        )
        .addColumn('org_id', 'integer', (col) => col.notNull())
        .addColumn('change_log_type', 'integer', (col) => col.notNull())
        .addColumn('change_log_status', 'integer', (col) => col.notNull())
        .addColumn('entity_id', 'integer', (col) => col)
        .addColumn('record_id', 'integer', (col) => col.notNull())
        .addColumn('type_id', 'integer', (col) => col)
        .addColumn('log_detail', 'text', (col) => col.notNull())
        .addColumn('last_modified', 'timestamp', (col) => col.notNull())
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('change_log').execute()
}
