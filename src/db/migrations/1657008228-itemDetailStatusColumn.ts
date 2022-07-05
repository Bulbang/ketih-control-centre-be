import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('item_detail')
        .addColumn('status', 'varchar(100)')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('item_detail').dropColumn('status').execute()
}
