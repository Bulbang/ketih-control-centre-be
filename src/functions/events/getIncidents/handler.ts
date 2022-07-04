import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { IncidentRepository } from '@libs/repositories/IncidentRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const incidentRepository = new IncidentRepository(db)

type LambdaReturn = {
    incidents: Awaited<ReturnType<typeof incidentRepository.getIncidents>>
}

const events: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const incidents = await incidentRepository.getIncidents()

    return {
        incidents,
    }
}

export const main = middyfy(events)
