import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { PeopleRepository } from '@libs/repositories/PeopleRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)

type LambdaReturn = {
    users: Awaited<ReturnType<typeof peopleRepository.getPeople>>
}

const getUsers: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage } = event.queryStringParameters as unknown as {
        page: number
        perPage: number
    }
    const users = await peopleRepository.getPeople({
        page,
        perPage,
    })
    return {
        users,
    }
}

export const main = middyfy(getUsers)
