import { Database } from '@declarations/db/tables'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class ChangeLogRepository extends MySQLRepository<Database> {
    getChangeLogs = async ({
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
    }: {
        page: number
        perPage: number
    }) =>
        this._db
            .selectFrom('change_log')
            .select([
                'change_log.change_log_id',
                'change_log.log_detail',
                'change_log.last_modified',
            ])
            .limit(perPage)
            .offset((page - 1) * perPage)
            .execute()
}
