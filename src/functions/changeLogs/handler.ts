import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { ChangeLogRepository } from '@libs/repositories/ChangeLogRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const changeLogRepository = new ChangeLogRepository(db)

type LambdaReturn = {
    changeLogs: Awaited<ReturnType<typeof changeLogRepository.getChangeLogs>>
}

const getChangeLogs: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const changeLogs = await changeLogRepository.getChangeLogs()

    return {
        changeLogs,
    }
}

export const main = middyfy(getChangeLogs)
