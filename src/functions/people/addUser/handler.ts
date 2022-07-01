import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { PeopleRepository } from '@libs/repositories/PeopleRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'
import schema from './schema'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)

const addUser: ValidatedEventAPIGatewayProxyEvent<typeof schema, void> = async (
    event,
) => {
    const { body } = event
    await peopleRepository.addUser(body)
}

export const main = middyfy(addUser)
