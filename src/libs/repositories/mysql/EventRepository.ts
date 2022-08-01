import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class EventRepository extends MySQLRepository<Database> {
    getEvent = async (id: number) =>
        this._db
            .selectFrom('event')
            .select([
                'event.event_id',
                'event.event_date',
                'event.action as event_type',
            ])
            .where('event.event_id', '=', id)
            .leftJoin(
                'work_order',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .select(['work_order.work_order_id'])
            .leftJoin(
                'event_classification',
                'event.event_key',
                'event_classification.event_key',
            )
            .select([
                'event_classification.short_desc',
                'event_classification.long_desc',
            ])
            .execute()

    getEventStats = async () =>
        this._db
            .selectFrom('event')
            .select(this._db.fn.count('event.event_id').as('events'))
            .leftJoin('incident', 'event.event_id', 'incident.event_id')
            .select(this._db.fn.count('incident.incident_id').as('incidents'))
            .execute()
}
