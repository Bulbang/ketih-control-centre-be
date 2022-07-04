import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

export class WorkOrderRepository extends MySQLRepository<Database> {
    getWorkOrders = async (dayInterval: number) => {
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
}
