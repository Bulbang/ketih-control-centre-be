import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class ItemDetailRepository extends MySQLRepository<Database> {
    getAssetsTotal = async () =>
        this._db
            .selectFrom('item_detail')
            .select(this._db.fn.count('item_detail.item_detail_id').as('total'))
            .execute()

    getAssetsByMake = async () =>
        this._db
            .selectFrom('item_detail')
            .select([
                'manufacturer',
                'model',
                this._db.fn.count('model').as('total'),
            ])
            .groupBy(['manufacturer', 'model'])
            .orderBy('total', 'desc')
            .execute()
    getItem = async (serial_number: string) =>
        this._db
            .selectFrom('item_detail')
            .select([
                'manufacturer as device_make',
                'model as device_model',
                'serial_number as device_serial_number',
                'status as device_status',
            ])
            .where('serial_number', '=', serial_number)
            .execute()
}
