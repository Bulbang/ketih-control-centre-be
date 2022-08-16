import { Database } from '@declarations/db/tables'
import { MySQLRepository } from './SQLRepository'

export class EventTypeRepository extends MySQLRepository<Database> {
    getEventTypes = async () =>
        this._db.selectFrom('type').select(['short_desc as status']).execute()
}
