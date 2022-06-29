import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('work_order').ifNotExists()
        .addColumn('work_order_id', 'integer', (col) =>
            col.primaryKey().autoIncrement(),
        )
        .addColumn('org_id', 'integer', (col) => col.notNull())
        .addColumn('xp_event_id', 'integer', (col) => col.notNull()) 
        .addColumn('client_work_order', 'varchar(100)', (col) => col)
        .addColumn('itsm_id', 'varchar(100)', (col) => col.notNull())
        .addColumn('kit_id', 'varchar(100)', (col) => col)
        .addColumn('periperal_description', 'text', (col) =>
            col,
        )
        .addColumn('employee_id', 'varchar(100)', (col) => col.notNull())
        .addColumn('runbook', 'varchar(100)', (col) => col.notNull())
        .addColumn('request_name', 'varchar(100)', (col) => col.notNull())
        .addColumn('request_type', 'varchar(100)', (col) => col.notNull())
        .addColumn('request_date', 'timestamp', (col) => col)
        .addColumn('request_fulfilled_date', 'timestamp', (col) =>
            col,
        )
        .addColumn('serial_number', 'varchar(100)', (col) => col)
        .addColumn('country', 'varchar(100)', (col) => col)
        .addColumn('expected_arrival_date', 'date', (col) =>
            col,
        )
        .addColumn('shipping_carrier', 'varchar(100)', (col) => col)
        .addColumn('shipping_method', 'varchar(100)', (col) => col)
        .addColumn('shipping_status', 'varchar(100)', (col) => col)
        .addColumn('tracking_number', 'varchar(100)', (col) => col)
        .addColumn('delivery_date', 'timestamp', (col) => col)
        .addColumn('completion_date', 'timestamp', (col) => col)
        .addColumn('return_shipping_status', 'varchar(100)', (col) =>
            col,
        )
        .addColumn('return_tracking_number', 'varchar(100)', (col) =>
            col,
        )
        .addColumn('return_delivery_date', 'timestamp', (col) =>
            col,
        )
        .addColumn('signature_required', 'int2', (col) => col)
        .addColumn('weekend_delivery', 'int2', (col) => col)
        .addColumn('expidited', 'int2', (col) => col)
        .addColumn('last_modified', 'timestamp', (col) => col)
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('work_order').execute()
}
