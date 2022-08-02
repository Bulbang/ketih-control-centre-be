import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { CountryRepository } from '@libs/repositories/mysql/CountryRepository'

const db = createDbConnection()
const countryRepository = new CountryRepository(db)

type LambdaReturn = {
    locations: {
        country_name: string
        country_code: string
    }[]
}

const getLocations: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const locations = await countryRepository.getCountries()

    return { locations }
}

export const main = middyfy(getLocations)
