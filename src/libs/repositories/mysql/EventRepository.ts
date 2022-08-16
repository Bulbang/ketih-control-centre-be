import { Database } from '@declarations/db/tables'
import { queryMiddleware } from '@libs/utils/dbUtils'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

export class EventRepository extends MySQLRepository<Database> {
    getAssociatedRequest = async (eventId: number) =>
        this._db
            .selectFrom('event')
            .leftJoin(
                'work_order',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .select([
                'work_order.work_order_id as request_id',
                'work_order.notes',
                'work_order.employee_id as impacted_user_id',
                'work_order.request_name as category',
                'work_order.request_date as date_opened',
                'work_order.completion_date as date_closed',
                sql<string>`CONCAT(work_order.city, ', ', work_order.state_or_province)`.as(
                    'location',
                ),
                sql<string[]>`JSON_ARRAYAGG(work_order.serial_number)`.as(
                    'serial_numbers',
                ),
            ])
            .where('event.event_id', '=', eventId)
            .groupBy([
                'work_order.work_order_id',
                'work_order.notes',
                'work_order.employee_id',
                'work_order.request_name',
                'work_order.request_date',
                'work_order.completion_date',
                'work_order.city',
                'work_order.state_or_province',
            ])
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

    getEventStats = async ({ last = 7 }: { last?: number }) =>
        queryMiddleware(
            this._db
                .selectFrom('event')
                .select(this._db.fn.count('event.event_id').as('events'))
                .leftJoin('incident', 'event.event_id', 'incident.event_id')
                .select(
                    this._db.fn.count('incident.incident_id').as('incidents'),
                ),
            { timeLimitter: { last, column: 'event.last_modified' } },
        ).execute()

    getAssociatedEvents = async (id: number) =>
        this._db
            .selectFrom('event')
            .select([
                'event.event_id',
                'event.event_date',
                'event.event_key',
                'event.action as event_type',

                sql<
                    {
                        start_date: string
                        incident_id: number
                        last_modified: string
                        description: string
                        response: string
                    }[]
                >`JSON_ARRAYAGG(JSON_OBJECT('incident_id',incident.incident_id, 'description', incident.response, 'start_date', incident.start_date, 'last_modified', incident.last_modified
                    ))`.as('incidents'),
                this._db.fn.count('incident.incident_id').as('incident_count'),
            ])
            .where(
                'event.work_order_id',
                '=',
                sql`(SELECT event.work_order_id FROM event WHERE event.event_id = ${id})`,
            )
            .where('event.event_id', '!=', id)
            .leftJoin(
                'event_classification',
                'event.event_key',
                'event_classification.event_key',
            )
            .select([
                'event_classification.long_desc',
                'event_classification.short_desc as status',
                'event_classification.priority',
            ])
            .leftJoin(
                'work_order',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .leftJoin('incident', 'incident.event_id', 'event.event_id')
            .groupBy([
                'event_classification.long_desc',
                'event_classification.short_desc',
                'event_classification.priority',
                'event.action',
                'event.event_id',
                'event.event_date',
                'event.event_key',
            ])
            .execute()
}
