import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { PeopleRepository } from '@libs/repositories/PeopleRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'
import schema from './schema'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)

const addUser: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    { message: string }
> = async (event) => {
    const { body } = event
    await peopleRepository.addUser(body)
    return { message: 'User Added succesfully' }
}

export const main = middyfy(addUser)
