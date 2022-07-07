import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class WorkOrderRepository extends MySQLRepository<Database> {
    getWorkOrders = async ({
        last = 7,
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
    }: {
        last: number
        page: number
        perPage: number
    }) =>
        this._db
            .selectFrom('work_order')
            .select([
                'work_order.work_order_id',
                'work_order.peripheral_description',
                'work_order.request_type',
                'work_order.runbook',
            ])
            .leftJoin(
                'event',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .select(['event.event_date as event_date', 'event.action'])
            .where(
                sql`event_date = (SELECT MAX(event.event_date) FROM event WHERE event.work_order_id = work_order.work_order_id)`,
            )
            .where(
                'event_date',
                '>=',
                sql`DATE(NOW() - INTERVAL ${last ? last : 7} DAY)`,
            )
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy('event_date', 'desc')
            // .groupBy([
            //     'work_order.work_order_id',
            //     'work_order.peripheral_description',
            //     'work_order.request_type',
            //     'work_order.runbook',
            //     'event.action',
            // ])
            .execute()

    getWorkOrderStats = async (dayInterval: number) => {
        const orders = await this._db
            .selectFrom('work_order')
            .select(['request_type', 'kit_id'])
            .where(
                'request_date',
                '>=',
                sql`DATE(NOW() - INTERVAL ${
                    dayInterval ? dayInterval : 7
                } DAY)`,
            )
            .execute()

        return {
            ordersCount: orders.length,
            warrantyRepairs: orders.reduce(
                (counter, order) =>
                    order.request_type.toLocaleLowerCase().includes('warranty')
                        ? counter + 1
                        : counter,
                0,
            ),
            onboardingKitDelivery: orders.reduce(
                (counter, order) => (order.kit_id ? counter + 1 : counter),
                0,
            ),
            eolRefreshProgress: Math.round(Math.random() * 10), // --- !!!
            deviceUpgrade: orders.reduce(
                (counter, order) =>
                    order.request_type.toLocaleLowerCase().includes('replace')
                        ? counter + 1
                        : counter,
                0,
            ),
        }
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
}
