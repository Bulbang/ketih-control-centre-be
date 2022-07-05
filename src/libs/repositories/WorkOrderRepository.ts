import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

export class WorkOrderRepository extends MySQLRepository<Database> {
    getWorkOrders = async (dayInterval?: number) =>
        this._db
            .selectFrom('work_order')
            .select([
                'work_order_id',
                'periperal_description',
                'request_type',
                'country',
            ])
            .where(
                'request_date',
                '>=',
                sql`DATE(NOW() - INTERVAL ${
                    dayInterval ? dayInterval : 7
                } DAY)`,
            )
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
