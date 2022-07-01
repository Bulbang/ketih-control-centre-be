import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('incident')
        .ifNotExists()
        .addColumn('incident_id', 'integer', (col) =>
            col.primaryKey().autoIncrement(),
        )
        // .addColumn('org_id', 'integer', (col) => col.notNull())
        .addColumn('event_id', 'integer', (col) => col.notNull())
        .addColumn('action', 'varchar(100)', (col) => col.notNull())
        // .addColumn('requestor', 'varchar(100)', (col) => col.notNull())
        // .addColumn('updated_by', 'varchar(100)', (col) => col.notNull())
        // .addColumn('closed_by', 'varchar(100)', (col) => col.notNull())
        // .addColumn('priority', 'integer', (col) => col.notNull())
        // .addColumn('acknowledged_by', 'varchar(100)', (col) => col.notNull())
        // .addColumn('start_date', 'timestamp', (col) => col.notNull())
        // .addColumn('end_date', 'timestamp', (col) => col.notNull())
        .addColumn('notes', 'text', (col) => col)
        .addColumn('last_modified', 'timestamp', (col) => col)

        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('incident').execute()
}
