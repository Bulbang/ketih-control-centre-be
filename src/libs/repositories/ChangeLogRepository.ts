import { Database } from '@declarations/db/tables'
import { MySQLRepository } from './SQLRepository'

export class ChangeLogRepository extends MySQLRepository<Database> {
    getChangeLogs = async () =>
        this._db
            .selectFrom('change_log')
            .select([
                'change_log.change_log_id',
                'change_log.log_detail',
                'change_log.last_modified',
            ])
            .leftJoin(
                'change_log_type',
                'change_log.change_log_type',
                'change_log_type.change_log_type_id',
            )
            .select('change_log_type.change_log_type_name')
            .execute()
}
