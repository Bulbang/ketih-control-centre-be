import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

export class WorkOrderRepository extends MySQLRepository<Database> {
    getWorkOrders = async (dayInterval?: number) => {
        return this._db
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
    }
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
}
