import { Database } from '@declarations/db/tables'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class IncidentRepository extends MySQLRepository<Database> {
    getIncidents = async ({
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
        countryCode,
        type,
    }: {
        page?: number
        perPage?: number
        countryCode?: string
        type?: string
    }) =>
        this._db
            .selectFrom('incident')
            .select(['incident.incident_id'])
            .leftJoin('event', 'event.event_id', 'incident.event_id')
            .select([
                'event.type as event_type',
                'event.event_id',
                'event.action',
            ])
            .leftJoin(
                'work_order',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .leftJoin('country', 'work_order.country', 'country.country_code')
            .if(countryCode?.length > 0, (qb) =>
                qb.where('work_order.country', '=', countryCode.toUpperCase()),
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
            .select([
                'event_classification.short_desc',
                'event_classification.long_desc',
            ])
            .limit(perPage)
            .offset((page - 1) * perPage)
            .execute()
}
