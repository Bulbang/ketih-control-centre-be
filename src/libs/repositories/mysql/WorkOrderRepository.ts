import { Database } from '@declarations/db/tables'
import { queryMiddleware } from '@libs/utils/dbUtils'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class WorkOrderRepository extends MySQLRepository<Database> {
    getReqsByActionDateAndDeliveryStatus = ({
        last = -1,
        orgs,
    }: {
        last: number
        orgs: number[]
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('work_order')
                .select([
                    'work_order.action_date',
                    sql<
                        string[]
                    >`JSON_ARRAYAGG(event_classification.short_desc)`.as(
                        'statuses',
                    ),
                ])
                .leftJoin(
                    'event_classification',
                    'work_order.xp_event_id',
                    'event_classification.xp_event_id',
                )
                .groupBy([
                    'work_order.action_date',
                    'event_classification.short_desc',
                ]),
            { timeLimitter: { last, column: 'work_order.last_modified' } },
        ).execute()

    getAdvancedReplacementsByItemType = async ({
        last = -1,
    }: {
        last?: number
        orgs: number[]
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('work_order')
                .innerJoin(
                    'item_detail',
                    'item_detail.serial_number',
                    'work_order.serial_number',
                )
                .select([
                    'item_detail.device_type as name',
                    this._db.fn.count('device_type').as('total'),
                ])
                .where(sql`LOWER(work_order.runbook)`, 'like', '%replace%')
                .groupBy('item_detail.device_type')
                .orderBy(sql`total`, 'desc'),
            { timeLimitter: { last, column: 'work_order.last_modified' } },
        ).execute()

    getAdvancedReplacementsByReasonCode = async ({
        last = -1,
    }: {
        last: number
        orgs: number[]
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('work_order')
                .select([
                    'work_order.reason_code as name',
                    this._db.fn.count('reason_code').as('total'),
                ])
                .groupBy('work_order.reason_code')
                .orderBy(sql`total`, 'desc'),
            { timeLimitter: { last, column: 'work_order.last_modified' } },
        ).execute()

    getAssociatedRequestsToAsset = async (serialNumbers: string[]) =>
        this._db
            .selectFrom('work_order')
            .select([
                'work_order.serial_number',
                sql<
                    {
                        request_id: number
                    }[]
                >`JSON_ARRAYAGG(JSON_OBJECT('request_id', work_order.work_order_id))`.as(
                    'requests',
                ),
            ])
            .where('work_order.serial_number', 'in', serialNumbers)
            .groupBy('work_order.serial_number')
            .execute()

    getWorkOrders = async ({
        last = -1,
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
        orgs: number[]
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('work_order')
                .select([
                    'work_order.work_order_id',
                    'work_order.runbook',
                    'work_order.request_date as event_date',
                ])
                .leftJoin(
                    'country',
                    'country.country_code',
                    'work_order.country',
                )
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
                ]),
            { timeLimitter: { last, column: 'work_order.last_modified' } },
        ).execute()

    getWorkOrderStats = async ({
        last = -1,
        priority,
        status,
        phase,
    }: {
        last?: number
        priority?: number
        status?: string
        phase?: string
        orgs: number[]
    }) => {
        const orders = await queryMiddleware(
            this._db
                .selectFrom('work_order')
                .select(['work_order.work_order_id'])
                .leftJoin(
                    'event_classification',
                    'work_order.xp_event_id',
                    'event_classification.xp_event_id',
                )
                .if(priority && priority > 0, (qb) =>
                    qb.where('event_classification.priority', '=', priority),
                )
                .if(status?.length > 0, (qb) =>
                    qb.where(
                        sql`LOWER(event_classification.short_desc)`,
                        '=',
                        status,
                    ),
                )
                .if(phase == 'urgent', (qb) =>
                    qb
                        .where('event_classification.priority', '<=', 2)
                        .where('work_order.completion_date', 'is', null),
                )
                .if(phase == 'in_deploy', (qb) =>
                    qb.where(
                        'event_classification.xp_event_id',
                        'in',
                        [100, 102, 103, 104, 105, 106, 107, 108],
                    ),
                )
                .if(phase == 'in_transit', (qb) =>
                    qb.where(
                        'event_classification.xp_event_id',
                        'in',
                        [201, 202, 203, 204, 205, 207],
                    ),
                )
                .if(phase == 'needs_verification', (qb) =>
                    qb.where(
                        'event_classification.xp_event_id',
                        'in',
                        [21, 22, 23, 31, 32, 41],
                    ),
                ),
            { timeLimitter: { last, column: 'work_order.last_modified' } },
        ).execute()

        return {
            orders_count: orders.length,
        }
    }

    getRequestDetail = async (id: number, orgs: number[]) => {
        return this._db
            .selectFrom('work_order')
            .select(['work_order.runbook', 'work_order.work_order_id'])
            .where('work_order.work_order_id', '=', id)
            .leftJoin(
                'event',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .select(['event.event_id', /* 'event.requestor', */ 'event.notes'])
            .leftJoin('incident', 'incident.event_id', 'event.event_id')
            .select(['incident.incident_id'])
            .execute()
    }

    getItemOverview = async ({
        last = -1,
    }: {
        last?: number
        orgs: number[]
    }) =>
        queryMiddleware(
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
                .groupBy(sql`month_index`),
            { timeLimitter: { last, column: 'work_order.last_modified' } },
        ).execute()

    getReqsByCategory = async ({
        last = -1,
    }: {
        last?: number
        orgs: number[]
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('work_order')
                .select([
                    'request_name as name',
                    this._db.fn.count('request_name').as('total'),
                ])
                .groupBy(['request_name'])
                .orderBy(sql`total`, 'desc'),
            { timeLimitter: { last, column: 'work_order.last_modified' } },
        ).execute()

    getReqsByService = async ({
        last = -1,
    }: {
        last: number
        orgs: number[]
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('work_order')
                .select([
                    sql<number>`COUNT(*)`.as('total'),
                    // 'shipping_method as name',
                    sql<number>`COUNT(IF(expedited = true, 1, NULL))`.as(
                        'expedited',
                    ),
                    sql<number>`COUNT(IF(weekend_delivery = true, 1, NULL))`.as(
                        'saturday_delivery',
                    ),
                    sql<number>`COUNT(IF(expedited != true AND weekend_delivery != true, 1, NULL))`.as(
                        'ground',
                    ),
                ])
                // .groupBy(['shipping_method'])
                .orderBy(sql`total`, 'desc'),
            { timeLimitter: { last, column: 'work_order.last_modified' } },
        ).execute()

    getReqsByStatus = async ({
        last = -1,
    }: {
        last?: number
        orgs: number[]
    }) =>
        queryMiddleware(
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
                .orderBy(sql`total`, 'desc'),
            { timeLimitter: { last, column: 'work_order.last_modified' } },
        ).execute()
}
