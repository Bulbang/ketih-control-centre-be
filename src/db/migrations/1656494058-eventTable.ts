import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('event').ifNotExists()
        .addColumn('event_id', 'integer', (col) =>
            col.primaryKey().autoIncrement(),
        )
        .addColumn('company_id', 'integer', (col) => col.notNull())
        .addColumn('work_order_id', 'integer', (col) =>
            col.notNull().references('work_order.work_order_id'),
        )
        .addColumn('requestor', 'varchar(100)', (col) => col.notNull())
        .addColumn('action', 'varchar(100)', (col) => col.notNull())
        .addColumn('event_key', 'varchar(100)', (col) => col.notNull())
        .addColumn('type', 'varchar(100)', (col) => col.notNull())
        .addColumn('event_date', 'timestamp', (col) => col.notNull())
        .addColumn('notes', 'text', (col) => col)
        .addColumn('last_modified', 'timestamp', (col) => col)
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('event').execute()
}
