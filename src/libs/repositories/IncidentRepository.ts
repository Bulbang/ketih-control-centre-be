import { Database } from '@declarations/db/tables'
import { MySQLRepository } from './SQLRepository'

export class IncidentRepository extends MySQLRepository<Database> {
    getIncidents = async () => {
        return this._db
            .selectFrom('incident')
            .select([
                'incident.incident_id',
                'incident.notes as incident_notes',
                'incident.action as incident_action',
            ])
            .leftJoin('event', 'event.event_id', 'incident.event_id')
            .select(['event.type as eventType', 'event.notes as event_notes'])
            .leftJoin(
                'work_order',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .select('work_order.country as country')
            .execute()
    }
}
