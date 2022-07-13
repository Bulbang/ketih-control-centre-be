import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

export class ChangeLogReactionsRepository extends MySQLRepository<Database> {
    getLogReactions = async ({
        logId,
        peopleId,
    }: {
        logId: number
        peopleId?: number
    }) =>
        this._db
            .selectFrom('change_log_reaction')
            .select([
                this._db.fn
                    .count('change_log_reaction.change_log_reaction_id')
                    .as('amount'),
                'emoji_code',
                sql<boolean>`if(people_id = ${peopleId}, TRUE, FALSE)`.as(
                    'pushed',
                ),
            ])
            .where('change_log_id', '=', logId)
            .groupBy(['emoji_code', sql`pushed`])
            .execute()
}
