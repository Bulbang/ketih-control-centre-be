import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { CountryRepository } from '@libs/repositories/CountryRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { EventTypeRepository } from '@libs/repositories/EventClassificationRepository'
import { badRequest } from '@hapi/boom'

const db = createDbConnection()
const countryRepository = new CountryRepository(db)
const eventTypeRepository = new EventTypeRepository(db)

type LambdaReturn =
    | {
          type: string
          long_desc: string
      }[]
    | {
          country_name: string
          country_code: string
      }[]

const getFilters: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { filterType } = event.queryStringParameters

    switch (filterType) {
        case 'country':
            const countries = await countryRepository.getCountries()
            return countries

        case 'type':
            const types = await eventTypeRepository.getEventTypes()
            return types
        default:
            throw badRequest(`Unknown filterType '${filterType}'`)
    }
}

export const main = middyfy(getFilters)
