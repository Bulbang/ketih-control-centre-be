import { Database } from '@declarations/db/tables'
import { queryMiddleware } from '@libs/utils/dbUtils'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class IncidentRepository extends MySQLRepository<Database> {
    getIncidents = async ({
        last = 7,
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
        countryCode,
        type,
    }: {
        last?: number
        page?: number
        perPage?: number
        countryCode?: string
        type?: string
    }) =>
        queryMiddleware(
            this._db
                .selectFrom('incident')
                .select(['incident.incident_id', 'incident.response'])
                .leftJoin('event', 'event.event_id', 'incident.event_id')
                .select([
                    sql<{
                        event_type: string
                        event_id: number
                        action: string
                        event_date: string
                        short_desc: string
                        long_desc: string
                    }>`JSON_OBJECT('event_type', event.type,
                    'event_id',event.event_id,
                    'action', event.action,
                    'event_date',event.event_date,
                    'short_desc', event_classification.short_desc,
                    'long_desc', event_classification.long_desc)`.as('event'),
                ])
                .leftJoin(
                    'work_order',
                    'event.work_order_id',
                    'work_order.work_order_id',
                )
                .leftJoin(
                    'country',
                    'work_order.country',
                    'country.country_code',
                )
                .if(countryCode?.length > 0, (qb) =>
                    qb.where(
                        'work_order.country',
                        '=',
                        countryCode.toUpperCase(),
                    ),
                )
                .if(type?.length > 0, (qb) =>
                    qb.where('event.action', '=', type.toLowerCase()),
                )
                .select([
                    'country.country_name as country',
                    'country.latitude',
                    'country.longitude',
                ])
                .leftJoin(
                    'event_classification',
                    'event.event_key',
                    'event_classification.event_key',
                )
                .select([])
                .limit(perPage)
                .offset((page - 1) * perPage),
            { timeLimitter: { last, column: 'incident.last_modified' } },
        ).execute()

    getIncident = async (id: number) =>
        this._db
            .selectFrom('incident')
            .select([
                'incident.incident_id',
                'incident.acknowledged_by',
                'incident.closed_by',
                'incident.priority',
                'incident.end_date',
                'incident.updated_by',
                'incident.event_id as triggering_event',
                'incident.last_modified',
                'incident.start_date',
            ])
            .where('incident.incident_id', '=', id)
            .leftJoin('event', 'event.event_id', 'incident.event_id')
            .select('event.notes')
            .leftJoin(
                'work_order',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .select('work_order.work_order_id')
            .execute()
}
