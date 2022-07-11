import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('change_log_reaction')
        .addColumn('change_log_reaction_id', 'integer', (col) =>
            col.primaryKey().autoIncrement(),
        )
        .addColumn('people_id', 'integer')
        .addColumn('change_log_id', 'integer')
        .addColumn('emoji_code', 'varchar(20)')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('change_log_reactions').execute()
}
