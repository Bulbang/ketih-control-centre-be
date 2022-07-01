import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { SQLRepository } from './SQLRepository'

export class WorkOrderRepository extends SQLRepository<Database> {
    getWorkOrders = async (dayInterval: number) => {
        return this._db
            .selectFrom('work_order')
            .select('work_order_id')
            .select('periperal_description')
            .select('request_type')
            .select('country')
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
