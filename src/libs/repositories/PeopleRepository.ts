import { Database } from '@declarations/db/tables'
import { sql } from 'kysely'
import { MySQLRepository } from './SQLRepository'

const DEFAULT_PAGE_OFFSET = 10

export class PeopleRepository extends MySQLRepository<Database> {
    getPeople = async ({
        page = 1,
        perPage = DEFAULT_PAGE_OFFSET,
    }: {
        page?: number
        perPage?: number
    }) => {
        const query = this._db
            .selectFrom('people')
            .select([
                'people_id',
                'first_name',
                'last_name',
                'phone_number_mobile',
                'phone_number_home',
                'country_code',
                'status',
                'business_unit',
                'position_title',
                'email_address_home',
                'email_address_work',
            ])
            .limit(perPage)
            .offset((page - 1) * perPage)
        return query.execute()
    }

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
