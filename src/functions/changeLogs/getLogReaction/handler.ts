import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { ChangeLogReactionsRepository } from '@libs/repositories/ChangeLogReactionsRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { badRequest } from '@hapi/boom'

const db = createDbConnection()
const changeLogReactionsRepository = new ChangeLogReactionsRepository(db)

type LambdaReturn = {
    reactions: {
        amount: unknown
        emoji_code: string
        pushed: boolean
    }[]
}

const getLogReaction: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { logId, peopleId } = event.pathParameters

    if (!logId) throw badRequest('Invalid change log id')

    if (!peopleId) throw badRequest('Invalid user id')

    const reactions = await changeLogReactionsRepository.getLogReactions({
        logId: +logId,
        peopleId: +peopleId,
    })

    return {
        reactions,
    }
}

export const main = middyfy(getLogReaction)
