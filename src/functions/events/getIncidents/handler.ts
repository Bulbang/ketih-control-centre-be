import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { IncidentRepository } from '@libs/repositories/mysql/IncidentRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const incidentRepository = new IncidentRepository(db)

type LambdaReturn = {
    incidents: {
        incident_id: number
        action: string
        latitude: number
        longitude: number
        event_type: string
        event_id: number
        country: string
        short_desc: string
        long_desc: string
        response: string
    }[]
}

const events: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage, countryCode, type, interval } =
        event.queryStringParameters as {
            interval?: string
            page?: string
            perPage?: string
            countryCode?: string
            type?: string
        }

    const incidents = await incidentRepository.getIncidents({
        last: interval ? +interval : undefined,
        page: page ? +page : undefined,
        perPage: perPage ? +perPage : undefined,
        countryCode,
        type,
    })

    return {
        incidents,
    }
}

export const main = middyfy(events)
