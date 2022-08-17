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

    getEventStats = async ({
        last = 7,
        priority,
        status,
        phase,
    }: {
        last?: number
        priority?: number
        status?: string
        phase?: string
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('event')
                .leftJoin(
                    'work_order',
                    'event.work_order_id',
                    'work_order.work_order_id',
                )
                .leftJoin(
                    'event_classification',
                    'work_order.xp_event_id',
                    'event_classification.xp_event_id',
                )
                .if(priority && priority > 0, (qb) =>
                    qb.where('event_classification.priority', '=', priority),
                )
                .if(status?.length > 0, (qb) =>
                    qb.where(
                        sql`LOWER(event_classification.short_desc)`,
                        '=',
                        status,
                    ),
                )
                .if(phase == 'urgent', (qb) =>
                    qb
                        .where('event_classification.priority', '<=', 2)
                        .where('work_order.completion_date', 'is', null),
                )
                .if(phase == 'in_deploy', (qb) =>
                    qb.where(
                        'event_classification.xp_event_id',
                        'in',
                        [100, 102, 103, 104, 105, 106, 107, 108],
                    ),
                )
                .if(phase == 'in_transit', (qb) =>
                    qb.where(
                        'event_classification.xp_event_id',
                        'in',
                        [201, 202, 203, 204, 205, 207],
                    ),
                )
                .if(phase == 'needs_verification', (qb) =>
                    qb.where(
                        'event_classification.xp_event_id',
                        'in',
                        [21, 22, 23, 31, 32, 41],
                    ),
                )
                .select(this._db.fn.count('event.event_id').as('events')),
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
