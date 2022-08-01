import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
// import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class V_eventRepository extends MySQLRepository<Database> {
    getRequests = async ({
        // last = 7,
        page = 1,
        perPage = 10,
        direction = 'asc',
        sortBy = 'work_order.work_order_id',
    }: {
        last?: number
        page?: number
        perPage?: number
        sortBy?: any
        direction?: 'desc' | 'asc'
    }) =>
        this._db
            .selectFrom('work_order')
            .innerJoin(
                'v_event',
                'work_order.work_order_id',
                'v_event.work_order_id',
            )
            .select('work_order.work_order_id')
            // .where(
            // 'work_order.request_date',
            // '>=',
            // sql`DATE(NOW() - INTERVAL ${last ? last : 7} DAY)`,
            // )
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(sortBy, direction)
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
                'request_date',
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
}
