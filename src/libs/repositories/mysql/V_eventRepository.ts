import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
// import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class V_eventRepository extends MySQLRepository<Database> {
    getRequests = async ({
        last = 7,
        page = 1,
        perPage = 10,
        direction = 'asc',
        sortBy = 'request_id',
        filter = 'all_requests',
    }: {
        last?: number
        page?: number
        perPage?: number
        sortBy?: any
        direction?: 'desc' | 'asc'
        filter?: string
    }) =>
        this._db
            .selectFrom('v_event')
            .select([
                'v_event.itsm_id as request_id',
                'v_event.requestor',
                'v_event.employee_id as impacted_user_id',
                'v_event.request_name as playbook',
                'v_event.request_date as date_opened',
                'v_event.completion_date as date_closed',
                sql<string>`CONCAT(v_event.city, ', ', country.country_name)`.as(
                    'location',
                ),
                sql<
                    {
                        device_type: string
                        device_make: string
                        device_model: string
                        device_color: string
                    }[]
                >`JSON_ARRAYAGG(CAST(v_event.peripheral_description as JSON))`.as(
                    'items',
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
                    }[]
                >`JSON_ARRAYAGG(JSON_OBJECT('event_id', v_event.event_id ,'event_date', v_event.request_date ,'priority', v_event.priority,'event_key', v_event.event_key,'short_desc', v_event.short_desc,'long_desc', v_event.long_desc,'event_type', v_event.action))`.as(
                    'events',
                ),
            ])
            .leftJoin('country', 'v_event.country', 'country.country_code')
            .leftJoin(
                'work_order',
                'work_order.work_order_id',
                'v_event.work_order_id',
            )
            .select('work_order.notes')
            .where(
                'v_event.request_date',
                '>=',
                sql`DATE(NOW() - INTERVAL ${last ? last : 7} DAY)`,
            )
            .if(filter == 'urgent', (qb) =>
                qb
                    .where('v_event.priority', '<=', '2')
                    .orWhere(
                        'v_event.event_key',
                        '=',
                        'request_closed_complete',
                    ),
            )
            .if(filter == 'in_deploy', (qb) =>
                qb.where(
                    'v_event.xp_event_id',
                    'in',
                    [100, 102, 103, 104, 105, 106, 107, 108],
                ),
            )
            .if(filter == 'in_transit', (qb) =>
                qb.where(
                    'v_event.xp_event_id',
                    'in',
                    [201, 202, 203, 204, 205, 207],
                ),
            )
            .if(filter == 'needs_verification', (qb) =>
                qb.where('v_event.xp_event_id', 'in', [21, 22, 23, 31, 32, 41]),
            )
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(sortBy, direction)
            .groupBy([
                'v_event.itsm_id',
                'v_event.requestor',
                'work_order.notes',
                'v_event.employee_id',
                'v_event.request_name',
                'v_event.request_date',
                'v_event.completion_date',
                sql`location`,
            ])
            .execute()
    getAllEvents = async ({
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
        sortBy = 'request_date',
        direction = 'desc',
    }: {
        page?: number
        perPage?: number
        sortBy?: any
        direction?: 'asc' | 'desc'
    }) =>
        this._db
            .selectFrom('v_event')
            .select([
                'v_event.event_id',
                'v_event.request_date as event_date',
                'v_event.priority',
                'v_event.event_key',
                sql<{
                    request_id: string
                }>`JSON_OBJECT('request_id', v_event.itsm_id)`.as('request'),
                'v_event.short_desc as status',
                'v_event.long_desc',
                'v_event.action as event_type',
                sql<{
                    notes: any
                    start_date: string
                    incident_id: number
                    last_modified: string
                }>`if(incident.incident_id is not null,
                    JSON_OBJECT('incident_id',
                    incident.incident_id,
                    'start_date',
                    incident.start_date,
                    'last_modified',
                    incident.last_modified,
                    'notes',
                    v_event.notes),
                    null)`.as('incident'),
            ])
            .where('v_event.event_id', 'is not', null)
            .leftJoin('incident', 'incident.incident_id', 'v_event.incident_id')
            .groupBy([
                'incident.incident_id',
                'incident.start_date',
                'incident.last_modified',
                'v_event.notes',
                'v_event.event_id',
                'v_event.request_date',
                'v_event.priority',
                'v_event.event_key',
                'v_event.short_desc',
                'v_event.long_desc',
                'v_event.action',
                'itsm_id',
            ])
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(sortBy, direction)
            .execute()
}
