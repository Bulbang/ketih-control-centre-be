import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { PeopleRepository } from '@libs/repositories/mysql/PeopleRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'
import schema from './schema'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)

const editUser: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    void
> = async (event) => {
    const { body } = event
    const { id } = event.pathParameters
    await peopleRepository.updateUser(+id, body)
}

export const main = middyfy(editUser)
