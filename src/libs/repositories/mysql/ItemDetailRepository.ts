import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class ItemDetailRepository extends MySQLRepository<Database> {
    getAssets = async ({
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
        direction = 'asc',
        sortBy = 'item_detail.item_detail_id',
    }: {
        page?: number
        perPage?: number
        sortBy?: any
        direction?: 'desc' | 'asc'
    }) =>
        this._db
            .selectFrom('item_detail')
            // .leftJoin(
            //     'item_detail',
            //     'work_order.serial_number',
            //     'item_detail.serial_number',
            // )
            .select([
                'item_detail.serial_number',
                'item_detail.item_detail_id as asset_tag',
                'item_detail.device_type as asset_type',
                sql<string>`CONCAT(item_detail.manufacturer, " ", item_detail.model)`.as(
                    'model',
                ),
                'item_detail.status',
                'item_detail.warranty_end_date as warranty_date',
                // sql<
                //     { request_id: string }[]
                // >`JSON_ARRAYAGG(JSON_OBJECT('request_id', work_order.work_order_id))`.as(
                //     'requests',
                // ),
            ])
            .groupBy([
                'item_detail.item_detail_id',
                'item_detail.device_type',
                `item_detail.manufacturer`,
                `item_detail.model`,
                'item_detail.status',
                'item_detail.warranty_end_date',
            ])
            .limit(perPage)
            .offset((page - 1) * perPage)
            .orderBy(sortBy, direction)
            .execute()

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
