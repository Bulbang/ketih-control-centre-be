import { Database } from '@declarations/db/tables'
import { MySQLRepository } from './SQLRepository'

export class EventRepository extends MySQLRepository<Database> {
    getAllEvents = async () => {
        return this._db
            .selectFrom('event')
            .select([
                'event.event_id',
                'event.action as event_action',
                'event.notes as event_notes',
                'event.type as event_type',
            ])
            .leftJoin(
                'work_order',
                'event.work_order_id',
                'work_order.work_order_id',
            )
            .select('work_order.country')
            .leftJoin('incident', 'incident.event_id', 'event.event_id')
            .select([
                'incident.incident_id',
                'incident.notes as incident_notes',
                'incident.action as incident_action',
            ])
            .execute()
    }
}
