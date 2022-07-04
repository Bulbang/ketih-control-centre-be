import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { PeopleRepository } from '@libs/repositories/PeopleRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)

type LambdaReturn = {
    users: Awaited<ReturnType<typeof peopleRepository.getPeople>>
    totalUsers: number
    activeMembers: number
}

const getUsers: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const users = await peopleRepository.getPeople()
    return {
        users,
        totalUsers: users.length,
        activeMembers: users.reduce(
            (counter, user) =>
                user.status.toLocaleLowerCase() === 'active'
                    ? counter + 1
                    : counter,
            0,
        ),
    }
}

export const main = middyfy(getUsers)
