import { Database } from '@declarations/db/tables'
import { SQLRepository } from './SQLRepository'

export class PeopleRepository extends SQLRepository<Database> {
    getPeople = async () => {
        return this._db
            .selectFrom('people')
            .select('people_id')
            .select('first_name')
            .select('last_name')
            .select('phone_number_mobile')
            .select('phone_number_home')
            .select('country_code')
            .select('status')
            .select('business_unit')
            .select('position_title')
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