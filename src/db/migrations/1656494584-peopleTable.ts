import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('people')
        .ifNotExists()
        .addColumn('people_id', 'integer', (col) =>
            col.primaryKey().autoIncrement(),
        )
        .addColumn('org_id', 'integer', (col) => col.notNull())
        .addColumn('address_id', 'integer', (col) => col.notNull())
        .addColumn('service_id', 'integer', (col) => col.notNull())
        .addColumn('access_id', 'integer', (col) => col.notNull())
        .addColumn('sam_account_name', 'varchar(100)', (col) => col)
        .addColumn('country_code', 'varchar(100)', (col) => col)
        .addColumn('site_name', 'varchar(100)', (col) => col)
        .addColumn('first_name', 'varchar(100)', (col) => col)
        .addColumn('last_name', 'varchar(100)', (col) => col)
        .addColumn('middle_name', 'varchar(100)', (col) => col)
        .addColumn('prefix', 'varchar(100)', (col) => col)
        .addColumn('suffix', 'varchar(100)', (col) => col)
        .addColumn('phone_number_mobile', 'varchar(100)', (col) => col)
        .addColumn('phone_number_home', 'varchar(100)', (col) => col)
        .addColumn('sms_allowed', 'boolean', (col) => col.notNull())
        .addColumn('email_address_home', 'varchar(100)', (col) => col)
        .addColumn('email_address_work', 'varchar(100)', (col) => col)
        .addColumn('manager', 'varchar(100)', (col) => col)
        .addColumn('business_unit', 'varchar(100)', (col) => col)
        .addColumn('business_function', 'varchar(100)', (col) => col)
        .addColumn('organization_name', 'varchar(100)', (col) => col)
        .addColumn('position_title', 'varchar(100)', (col) => col)
        .addColumn('status', 'varchar(100)', (col) => col)
        .addColumn('last_modified', 'timestamp', (col) => col.notNull())
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('people').execute()
}
