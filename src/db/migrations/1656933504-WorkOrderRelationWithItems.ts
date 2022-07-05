import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('work_order')
        .addColumn('itsm_id', 'integer')
        .execute()

    await db.schema
        .alterTable('work_order')
        .addForeignKeyConstraint('itsm_id_FK', ['itsm_id'], 'item', ['item_id'])
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('work_order')
        .dropConstraint('itsm_id_FK')
        .execute()
    await db.schema.alterTable('work_order').dropColumn('itsm_id').execute()
}
