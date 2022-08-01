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
        sortBy = 'v_event.itsm_id',
    }: {
        last?: number
        page?: number
        perPage?: number
        sortBy?: any
        direction?: 'desc' | 'asc'
    }) =>
        this._db
            .selectFrom('v_event')
            .select([
                'v_event.itsm_id as request_id',
                'v_event.requestor',
                'v_event.notes',
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
            .where(
                'v_event.request_date',
                '>=',
                sql`DATE(NOW() - INTERVAL ${last ? last : 7} DAY)`,
            )
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(sortBy, direction)
            .groupBy([
                'v_event.itsm_id',
                'v_event.requestor',
                'v_event.notes',
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
        sortBy: any
        direction: 'asc' | 'desc'
    }) =>
        this._db
            .selectFrom('v_event')
            .select([
                'event_id',
                'request_date as event_date',
                'priority',
                'event_key',
                sql<{
                    request_id: string
                }>`JSON_OBJECT('request_id', v_event.itsm_id)`.as('request'),
                'short_desc',
                'long_desc',
                'action as event_type',
            ])
            .where('event_id', 'is not', null)
            .groupBy([
                'event_id',
                'request_date',
                'priority',
                'event_key',
                'short_desc',
                'long_desc',
                'action',
                'itsm_id',
            ])
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(sortBy, direction)
            .execute()
}
