import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('item')
        .ifNotExists()
        .addColumn('item_id', 'integer', (col) =>
            col.primaryKey().autoIncrement(),
        )
        .addColumn('item_detail_id', 'integer')
        .addColumn('org_id', 'integer', (col) => col.notNull())
        .addColumn('entity_id', 'integer', (col) => col.notNull())
        .addColumn('service_id', 'integer', (col) => col.notNull())
        .addColumn('address', 'integer', (col) => col.notNull())
        .addColumn('status', 'integer', (col) => col.notNull())
        .addColumn('operational_status', 'integer', (col) => col.notNull())
        .addColumn('managed_by', 'varchar(100)', (col) => col.notNull())
        .addColumn('owned_by', 'varchar(100)', (col) => col.notNull())
        .addColumn('last_modified', 'timestamp', (col) => col.notNull())

        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('item').execute()
}
