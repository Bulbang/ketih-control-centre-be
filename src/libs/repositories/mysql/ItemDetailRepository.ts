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
        page: number
        perPage: number
        sortBy: any
        direction: 'desc' | 'asc'
    }) =>
        this._db
            .selectFrom('item_detail')
            .select([
                'item_detail.item_detail_id as asset_tag',
                'item_detail.device_type as asset_type',
                sql<string>`CONCAT(item_detail.manufacturer, " ", item_detail.model)`.as(
                    'model',
                ),
                'item_detail.status',
                'item_detail.warranty_end_date as warranty_date',
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
}
