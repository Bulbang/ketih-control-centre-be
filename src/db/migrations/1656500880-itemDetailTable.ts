import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('item_detail').ifNotExists()
        .addColumn('item_detail_id', 'integer', (col) =>
            col.primaryKey().autoIncrement(),
        )
        .addColumn('item_id', 'integer', (col) => col.references('item.item_id'))
        .addColumn('org_id', 'integer', (col) => col.notNull())
        .addColumn('computer_name', 'varchar(100)', (col) => col)
        .addColumn('serial_number', 'varchar(100)', (col) => col)
        .addColumn('manufacturer', 'text', (col) => col)
        .addColumn('model', 'text', (col) => col)
        .addColumn('kit_id', 'varchar(100)', (col) => col)
        .addColumn('device_type', 'varchar(100)', (col) => col)
        .addColumn('warranty_end_date', 'date', (col) => col)
        .addColumn('user', 'varchar(100)', (col) => col)
        .addColumn('email', 'varchar(100)', (col) => col)
        .addColumn('site_name', 'text', (col) => col)
        .addColumn('location_type', 'text', (col) => col)
        .addColumn('country_code', 'varchar(100)', (col) => col)
        .addColumn('country_name', 'text', (col) => col)
        .addColumn('region', 'varchar(100)', (col) => col)
        .addColumn('business_unit', 'text', (col) => col)
        .addColumn('function', 'text', (col) => col)
        .addColumn('status', 'varchar(100)', (col) => col)
        .addColumn('last_logged_on', 'datetime', (col) => col)
        .addColumn('os', 'text', (col) => col)
        .addColumn('build', 'text', (col) => col)
        .addColumn('contract', 'varchar(100)', (col) => col)
        .addColumn('processor_name', 'text', (col) => col)
        .addColumn('drive_size', 'integer', (col) => col)
        .addColumn('drive_free_space', 'integer', (col) => col)
        .addColumn('total_memory_in_g', 'integer', (col) => col)
        .addColumn('last_modified', 'timestamp', (col) => col)
        .execute()
}
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('item_detail').execute()
}
