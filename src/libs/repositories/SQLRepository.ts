import { Kysely } from 'kysely'

export class SQLRepository<DB> {
    constructor(protected _db: Kysely<DB>) {}
}
