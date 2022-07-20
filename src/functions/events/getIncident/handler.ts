import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { IncidentRepository } from '@libs/repositories/mysql/IncidentRepository'

const db = createDbConnection()
const incidentRepository = new IncidentRepository(db)

type LambdaReturn = {
    incident_id: number
    acknowledged_by: string
    closed_by: string
    priority: number
    updated_by: string
    triggering_event: number
    last_modified: string
    start_date: number
    notes: string
    work_order_id: number
}

const getIncident: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { id } = event.pathParameters

    const [incident] = await incidentRepository.getIncident(+id)

    return incident
}

export const main = middyfy(getIncident)
