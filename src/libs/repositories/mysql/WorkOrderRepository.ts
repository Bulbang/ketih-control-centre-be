import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class WorkOrderRepository extends MySQLRepository<Database> {
    getWorkOrders = async ({
        last = 7,
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
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
            .select([
                'work_order.work_order_id',
                'work_order.runbook',
                'work_order.request_date as event_date',
            ])
            .leftJoin('country', 'country.country_code', 'work_order.country')
            .select(['country.country_name as location'])
            .rightJoin(
                'event',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            // .select(['event.event_id', 'event.requestor'])
            // .leftJoin('incident', 'incident.event_id', 'event.event_id')
            // .select([
            // sql<number>`COUNT(DISTINCT incident.incident_id)`.as('incidents'),
            // 'incident.acknowledged_by as impacted',
            // 'incident.end_date',
            // ])
            // .where(sql`incident.incident_id is not null`)
            .where(
                'work_order.request_date',
                '>=',
                sql`DATE(NOW() - INTERVAL ${last ? last : 7} DAY)`,
            )
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(sortBy, direction)
            .groupBy([
                'work_order.work_order_id',
                // 'work_order.peripheral_description',
                // 'work_order.request_type',
                // 'work_order.runbook',
                'event_date',
                'country.country_name',
            ])
            .execute()

    getWorkOrderStats = async () => {
        const orders = await this._db
            .selectFrom('work_order')
            .select(['request_type', 'kit_id'])
            // .where(
            //     'request_date',
            //     '>=',
            //     sql`DATE(NOW() - INTERVAL ${
            //         dayInterval ? dayInterval : 7
            //     } DAY)`,
            // )
            .execute()

        return {
            ordersCount: orders.length,
        }
    }

    getRequestDetail = async (id: number) => {
        return this._db
            .selectFrom('work_order')
            .select(['work_order.runbook', 'work_order.work_order_id'])
            .where('work_order.work_order_id', '=', id)
            .leftJoin(
                'event',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .select(['event.event_id', 'event.requestor', 'event.notes'])
            .leftJoin('incident', 'incident.event_id', 'event.event_id')
            .select(['incident.incident_id'])
            .execute()
    }

    getItemOverview = async () =>
        this._db
            .selectFrom('work_order')
            .select([
                this._db.fn.count('work_order_id').as('total'),
                sql<number>`COUNT(IF(LOWER(shipping_status) = 'cancelled', 1, null))`.as(
                    'cancelled',
                ),
                sql<number>`COUNT(IF(LOWER(shipping_status) = 'delivered', 1, null))`.as(
                    'delivered',
                ),
                sql<number>`COUNT(IF(shipping_status is null, 1, null))`.as(
                    'in_process',
                ),
                sql<number>`COUNT(IF(LOWER(shipping_status) = 'shipped', 1, null))`.as(
                    'shipped',
                ),
                sql<number>`COUNT(IF(LOWER(shipping_status) = 'ordered', 1, null))`.as(
                    'ordered',
                ),
                sql<string>`DATE_FORMAT(last_modified , '%m')*1-1`.as(
                    'month_index',
                ),
            ])
            .where(
                sql`YEAR(last_modified)`,
                '>',
                sql`YEAR(DATE_SUB(NOW(), INTERVAL 1 YEAR))`,
            )
            .groupBy(sql`month_index`)
            .execute()

    getReqsByCategory = async () =>
        this._db
            .selectFrom('work_order')
            .select([
                'request_name as name',
                this._db.fn.count('request_name').as('total'),
            ])
            .groupBy(['request_name'])
            .orderBy(sql`total`, 'desc')
            .execute()

    getReqsByService = async () =>
        this._db
            .selectFrom('work_order')
            .select([
                'shipping_method as name',
                this._db.fn.count('shipping_method').as('total'),
            ])
            .groupBy(['shipping_method'])
            .orderBy(sql`total`, 'desc')
            .execute()

    getReqsByStatus = async () =>
        this._db
            .selectFrom('work_order')
            .leftJoin(
                'event_classification',
                'work_order.xp_event_id',
                'event_classification.xp_event_id',
            )
            .select([
                'event_classification.short_desc as name',
                this._db.fn
                    .count('event_classification.short_desc')
                    .as('total'),
            ])
            .groupBy(['event_classification.short_desc'])
            .orderBy(sql`total`, 'desc')
            .execute()
}
