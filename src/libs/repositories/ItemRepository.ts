import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

export class ItemRepository extends MySQLRepository<Database> {
    getItemsWithDetails = async () =>
        this._db
            .selectFrom('item')
            .leftJoin('item_detail', 'item.item_id', 'item_detail.item_id')
            .select([
                'item_detail.status as status',
                'item_detail.device_type as deviceType',
            ])
            .execute()

    countOrdersByDeviceType = async () =>
        this._db
            .selectFrom('item')
            .leftJoin('item_detail', 'item.item_id', 'item_detail.item_id')
            .select([
                sql<number>`COUNT(IF(LOWER(item_detail.device_type) = 'laptop', 1 , null))`.as(
                    'laptops',
                ),
                sql<number>`COUNT(IF(LOWER(item_detail.device_type) = 'mobile', 1 , null))`.as(
                    'mobiles',
                ),
                sql<number>`COUNT(IF(LOWER(item_detail.device_type) = 'tablet', 1 , null))`.as(
                    'tablets',
                ),
                sql<string>`DATE_FORMAT(item.last_modified , '%m')*1-1`.as(
                    'month_index',
                ),
            ])
            .where(
                sql`YEAR(item.last_modified)`,
                '>',
                sql`YEAR(DATE_SUB(NOW(), INTERVAL 1 YEAR))`,
            )
            .groupBy(sql`month_index`)
            .execute()
}
