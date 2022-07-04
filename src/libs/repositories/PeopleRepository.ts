import { Database } from '@declarations/db/tables'
import { MySQLRepository } from './SQLRepository'

export class PeopleRepository extends MySQLRepository<Database> {
    getPeople = async () => {
        return this._db
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
            ])
            .execute()
    }

    updateUser = async <UserSchema>(id: number, valuesToUpdate: UserSchema) => {
        return this._db
            .updateTable('people')
            .set(valuesToUpdate)
            .where('people_id', '=', id)
            .execute()
    }

    addUser = async <UserSchema>(user: UserSchema) => {
        return this._db
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
}
