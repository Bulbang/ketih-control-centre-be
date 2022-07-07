import { Database } from '@declarations/db/tables'
import { MySQLRepository } from './SQLRepository'

export class CountryRepository extends MySQLRepository<Database> {
    getCountries = async () =>
        this._db
            .selectFrom('country')
            .select(['country.country_name', 'country.country_code'])
            .execute()
}
