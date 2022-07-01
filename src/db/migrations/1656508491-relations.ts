import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await Promise.all([
        // db.schema
        //     .alterTable('work_order')
        //     .addForeignKeyConstraint(
        //         'event_xp_id_fk',
        //         ['xp_event_id'],
        //         'event',
        //         ['event_id'],
        //     )
        //     .execute(),
        db.schema
            .alterTable('event')
            .addForeignKeyConstraint(
                'work_order_id_FK',
                ['work_order_id'],
                'work_order',
                ['work_order_id'],
            )
            .execute(),
        db.schema
            .alterTable('incident')
            .addForeignKeyConstraint('event_id_FK', ['event_id'], 'event', [
                'event_id',
            ])
            .execute(),
        db.schema
            .alterTable('change_log')
            .addForeignKeyConstraint(
                'type_FK',
                ['change_log_type'],
                'change_log_type',
                ['change_log_type_id'],
            )
            .execute(),

        db.schema
            .alterTable('change_log')
            .addForeignKeyConstraint(
                'status_FK',
                ['change_log_status'],
                'change_log_status',
                ['change_log_status_id'],
            )
            .execute(),

        // db.schema
        //     .alterTable('item')
        //     .addForeignKeyConstraint(
        //         'details_FK',
        //         ['item_detail_id'],
        //         'item_detail',
        //         ['item_detail_id'],
        //     )
        //     .execute(),

        db.schema
            .alterTable('item_detail')
            .addForeignKeyConstraint('item_FK', ['item_id'], 'item', [
                'item_id',
            ])
            .execute(),
    ])
}

export async function down(db: Kysely<any>): Promise<void> {
    await Promise.all([
        // db.schema
        //     .alterTable('work_order')
        //     .dropConstraint('event_xp_id_fk')
        //     .execute(),
        db.schema
            .alterTable('event')
            .dropConstraint('work_order_id_FK')
            .execute(),
        db.schema
            .alterTable('incident')
            .dropConstraint('event_id_FK')
            .execute(),
        db.schema.alterTable('change_log').dropConstraint('type_FK').execute(),

        db.schema
            .alterTable('change_log')
            .dropConstraint('status_FK')
            .execute(),

        // db.schema.alterTable('item').dropConstraint('details_FK').execute(),

        db.schema.alterTable('item_detail').dropConstraint('item_FK').execute(),
    ])
}
