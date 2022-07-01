import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { PeopleRepository } from '@libs/repositories/PeopleRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)

const getUsers: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    { users: Awaited<ReturnType<typeof peopleRepository.getPeople>> }
> = async (_) => {
    const users = await peopleRepository.getPeople()
    return {
        users,
        totalUsers: users.length,
        activeMembers: users.reduce((counter, user) => {
            return user.status === 'Active' ? counter + 1 : counter
        }, 0),
    }
}

export const main = middyfy(getUsers)
