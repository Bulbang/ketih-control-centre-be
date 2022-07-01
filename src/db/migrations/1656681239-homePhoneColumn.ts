import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('people')
        .addColumn('phone_number_home', 'varchar(100)')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('people')
        .dropColumn('phone_number_home')
        .execute()
}
