import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { ChangeLogRepository } from '@libs/repositories/ChangeLogRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const changeLogRepository = new ChangeLogRepository(db)

type LambdaReturn = {
    changeLogs: {
        change_log_id: unknown
        log_detail: string
        last_modified: string
    }[]
}

const getChangeLogs: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage } = event.queryStringParameters as {
        page?: number
        perPage?: number
    }
    const changeLogs = await changeLogRepository.getChangeLogs({
        page,
        perPage,
    })

    return {
        changeLogs,
    }
}

export const main = middyfy(getChangeLogs)
