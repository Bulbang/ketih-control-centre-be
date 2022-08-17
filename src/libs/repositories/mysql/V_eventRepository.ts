import { Database } from '@declarations/db/tables'
import { queryMiddleware } from '@libs/utils/dbUtils'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class V_eventRepository extends MySQLRepository<Database> {
    getRequests = async ({
        last = 7,
        page = 1,
        perPage = 10,
        direction = 'asc',
        sortBy = 'request_id',
        phase,
        priority,
        status,
    }: {
        last?: number
        page?: number
        perPage?: number
        sortBy?: any
        direction?: 'desc' | 'asc'
        phase?: string
        priority?: number
        status?: string
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('v_event')
                .select([
                    'v_event.work_order_id as request_id',
                    // 'v_event.requestor',
                    'v_event.employee_id as impacted_user_id',
                    'v_event.request_name as category',
                    'v_event.request_date as date_opened',
                    'v_event.completion_date as date_closed',
                    sql<string>`CONCAT(v_event.city, ', ', v_event.state_or_province)`.as(
                        'location',
                    ),
                    this._db.fn
                        .count('v_event.incident_id')
                        .as('incidents_count'),
                    sql<string[]>`JSON_ARRAYAGG(v_event.serial_number)`.as(
                        'serial_numbers',
                    ),
                    sql<
                        {
                            event_id: number
                            priority: number
                            event_key: string
                            long_desc: string
                            event_date: string
                            event_type: string
                            short_desc: string
                            incidents: {
                                start_date: string
                                incident_id: number
                                last_modified: string
                                description: string
                            }[]
                        }[]
                    >`JSON_ARRAYAGG(JSON_INSERT(
                    JSON_OBJECT('event_id',
                    v_event.event_id ,
                    'event_date',
                    v_event.event_date ,
                    'priority',
                    v_event.priority,
                    'event_key',
                    v_event.event_key,
                    'short_desc',
                    v_event.short_desc,
                    'long_desc',
                    v_event.long_desc,
                    'event_type',
                    v_event.action
                     ),
                    '$.incidents',
                    JSON_ARRAY(
                        JSON_OBJECT('incident_id',
                        incident.incident_id,
                        'description', 
                        incident.response,
                        'start_date',
                        incident.start_date,
                        'last_modified',
                        incident.last_modified
                        ))
                    ))`.as('events'),
                ])
                .leftJoin(
                    'event_classification',
                    'event_classification.xp_event_id',
                    'v_event.xp_event_id',
                )
                .select([
                    'event_classification.short_desc as status',
                    'event_classification.priority',
                ])
                .leftJoin(
                    'incident',
                    'v_event.incident_id',
                    'incident.incident_id',
                )
                .leftJoin(
                    'work_order',
                    'work_order.work_order_id',
                    'v_event.work_order_id',
                )
                .select('work_order.notes')
                .if(!!priority, (qb) =>
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
                        .where('v_event.completion_date', 'is', null),
                )
                .if(phase == 'in_deploy', (qb) =>
                    qb.where(
                        'v_event.xp_event_id',
                        'in',
                        [100, 102, 103, 104, 105, 106, 107, 108],
                    ),
                )
                .if(phase == 'in_transit', (qb) =>
                    qb.where(
                        'v_event.xp_event_id',
                        'in',
                        [201, 202, 203, 204, 205, 207],
                    ),
                )
                .if(phase == 'needs_verification', (qb) =>
                    qb.where(
                        'v_event.xp_event_id',
                        'in',
                        [21, 22, 23, 31, 32, 41],
                    ),
                ),

            { timeLimitter: { last, column: 'work_order.last_modified' } },
        )
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(sortBy, direction)
            .groupBy([
                'event_classification.priority',
                'event_classification.short_desc',
                'v_event.work_order_id',
                // 'v_event.requestor',
                'work_order.notes',
                'v_event.employee_id',
                'v_event.request_name',
                'v_event.request_date',
                'v_event.completion_date',
                sql`location`,
            ])
            .execute()

    getAllEvents = async ({
        last = 7,
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
        sortBy = 'v_event.event_date',
        direction = 'desc',
        priority,
        status,
    }: {
        last?: number
        page?: number
        perPage?: number
        sortBy?: any
        direction?: 'asc' | 'desc'
        priority?: number
        status?: string
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('v_event')
                .select([
                    'v_event.event_id',
                    'v_event.event_date',
                    'v_event.priority',
                    this._db.fn
                        .count('v_event.incident_id')
                        .as('incident_count'),
                    'v_event.event_key',
                    sql<{
                        request_id: string
                        notes: string
                        serial_numbers: string[]
                    }>`JSON_INSERT(JSON_OBJECT('request_id', v_event.work_order_id, 'notes', work_order.notes), '$.serial_numbers', JSON_ARRAYAGG(work_order.serial_number))`.as(
                        'request',
                    ),
                    'v_event.short_desc as status',
                    'v_event.long_desc',
                    'v_event.action as event_type',
                    sql<
                        {
                            start_date: string
                            incident_id: number
                            last_modified: string
                            description: string
                            response: string
                        }[]
                    >`JSON_ARRAYAGG(
                JSON_OBJECT('incident_id',
                incident.incident_id,
                'description', 
                incident.response,
                'start_date',
                incident.start_date,
                'last_modified',
                incident.last_modified
                ))`.as('incidents'),
                    sql<
                        {
                            event_id: number
                            priority: number
                            event_key: string
                            long_desc: string
                            event_date: string
                            event_type: string
                            short_desc: string
                            incident: {
                                start_date: string
                                incident_id: number
                                last_modified: string
                                description: string
                            }
                        }[]
                    >`JSON_ARRAYAGG(JSON_INSERT(
                JSON_OBJECT('event_id',
                v_event.event_id ,
                'event_date',
                v_event.event_date ,
                'priority',
                v_event.priority,
                'event_key',
                v_event.event_key,
                'short_desc',
                v_event.short_desc,
                'long_desc',
                v_event.long_desc,
                'event_type',
                v_event.action
                 ),
                '$.incidents',
                JSON_ARRAY(
                    JSON_OBJECT('incident_id',
                    incident.incident_id,
                    'description', 
                    incident.response,
                    'start_date',
                    incident.start_date,
                    'last_modified',
                    incident.last_modified
                    ))
                ))`.as('events'),
                ])
                .where('v_event.event_id', 'is not', null)
                .leftJoin(
                    'incident',
                    'incident.incident_id',
                    'v_event.incident_id',
                )
                .leftJoin(
                    'work_order',
                    'work_order.work_order_id',
                    'v_event.work_order_id',
                )
                .if(!!priority, (qb) =>
                    qb.where('v_event.priority', '=', priority),
                )
                .if(status?.length > 0, (qb) =>
                    qb.where(sql`LOWER(v_event.short_desc)`, '=', status),
                )
                .groupBy([
                    'incident.incident_id',
                    'incident.start_date',
                    'incident.last_modified',
                    // 'wokr_order.notes',
                    'v_event.event_id',
                    'v_event.event_date',
                    'v_event.priority',
                    'v_event.event_key',
                    'v_event.short_desc',
                    'v_event.long_desc',
                    'v_event.action',
                    'v_event.work_order_id',
                ])
                .limit(perPage)
                .offset((page - 1) * perPage)
                .orderBy(sortBy, direction),
            { timeLimitter: { last, column: 'v_event.last_modified' } },
        ).execute()
}
