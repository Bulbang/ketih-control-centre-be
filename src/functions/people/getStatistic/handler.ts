import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { PeopleRepository } from '@libs/repositories/mysql/PeopleRepository'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)

type LambdaReturn = {
    statistic: {
        total: number
        active: number
    }
}

const getStatistic: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const [stats] = await peopleRepository.getStatistic()
    return {
        statistic: stats,
    }
}

export const main = middyfy(getStatistic)
