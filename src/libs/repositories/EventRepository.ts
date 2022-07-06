import { Database } from '@declarations/db/tables'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class EventRepository extends MySQLRepository<Database> {
    getAllEvents = async ({
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
    }: {
        page?: number
        perPage?: number
    }) =>
        this._db
            .selectFrom('event')
            .select(['event.event_id', 'event.type as event_type'])
            .leftJoin(
                'work_order',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .leftJoin('country', 'work_order.country', 'country.country_code')
            .select('country.country_name as country')
            .leftJoin(
                'event_classification',
                'event.event_key',
                'event_classification.event_key',
            )
            .select([
                'event_classification.short_desc',
                'event_classification.long_desc',
            ])
            .limit(perPage)
            .offset((page - 1) * perPage)
            .execute()
    getEventStats = async () =>
        this._db
            .selectFrom('event')
            .select(this._db.fn.count('event.event_id').as('events'))
            .leftJoin('incident', 'event.event_id', 'incident.event_id')
            .select(this._db.fn.count('incident.incident_id').as('incidents'))
            .execute()
}
