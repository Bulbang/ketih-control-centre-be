import { ReferenceExpression, SelectQueryBuilder, sql } from 'kysely'

export const queryMiddleware = <DB, TB extends keyof DB, O>(
    query: SelectQueryBuilder<DB, TB, O>,
    {
        timeLimitter,
        org,
    }: {
        timeLimitter?: { last: number; column: ReferenceExpression<DB, TB> }
        org?: { orgs: number[]; column: ReferenceExpression<DB, TB> }
    },
) => {
    return query
        .if(timeLimitter?.last > 0, (qb) =>
            qb.where(
                timeLimitter?.column,
                '>=',
                sql`DATE(NOW() - INTERVAL ${timeLimitter?.last} DAY)`,
            ),
        )
        .if(org?.orgs?.length > 0, (qb) => qb.where(org.column, 'in', org.orgs))
}

// export const queryExecutor = <T extends MySQLRepository<Database>>(obj: T) => {
//     let handler = {
//         get(target: T, propKey, receiver) {
//             const origMethod: Function = target[propKey];
//             return  (...args) => {
//                 let result: SelectQueryBuilder<Database, any, any> = origMethod.apply(this, args);
//                 return result.execute();
//             };
//         }
//     };
//     return new Proxy<T>(obj, handler);
//   }
