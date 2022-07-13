import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const { DEFAULT_PAGE_OFFSET } = process.env

export class PeopleRepository extends MySQLRepository<Database> {
    getPeople = async ({
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
    }: {
        page?: number
        perPage?: number
    }) =>
        this._db
            .selectFrom('people')
            .select([
                'people.people_id',
                'people.first_name',
                'people.last_name',
                'people.phone_number_mobile',
                'people.phone_number_home',
                'people.status',
                'people.business_unit',
                'people.position_title',
                'people.email_address_home',
                'people.email_address_work',
            ])
            .leftJoin('country', 'people.country_code', 'country.country_code')
            .select('country.country_name')
            .limit(perPage)
            .offset((page - 1) * perPage)
            .execute()

    getStatistic = async () =>
        this._db
            .selectFrom('people')
            .select([
                this._db.fn.count<number>('people.people_id').as('total'),
                sql<number>`COUNT(IF(LOWER(status) = 'active', 1 , null))`.as(
                    'active',
                ),
            ])
            .execute()

    updateUser = async <UserSchema>(id: number, valuesToUpdate: UserSchema) =>
        this._db
            .updateTable('people')
            .set(valuesToUpdate)
            .where('people_id', '=', id)
            .execute()

    addUser = async <UserSchema>(user: UserSchema) =>
        this._db
            .insertInto('people')
            .values({
                ...user,
                last_modified: new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' '),
            })
            .execute()
}
