import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class EventRepository extends MySQLRepository<Database> {
    getAllEvents = async ({
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
        sortBy = 'event_date',
        direction = 'desc',
    }: {
        page?: number
        perPage?: number
        sortBy: any
        direction: 'asc' | 'desc'
    }) =>
        this._db
            .selectFrom('v_event')
            .select([
                'event_id',
                'event_date',
                'priority',
                'event_key',
                sql<any>`GROUP_CONCAT(JSON_OBJECT('request_id', v_event.itsm_id) order by v_event.itsm_id SEPARATOR ',')`.as(
                    'request',
                ),
                'short_desc',
                'long_desc',
                'action as event_type',
            ])
            .where('event_id', 'is not', null)
            .groupBy([
                'event_id',
                'event_date',
                'priority',
                'event_key',
                'short_desc',
                'long_desc',
                'action',
            ])
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(sortBy, direction)
            .execute()

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
