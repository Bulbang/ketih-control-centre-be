import { Kysely } from 'kysely'

export class MySQLRepository<DB> {
    constructor(protected _db: Kysely<DB>) {}
}
