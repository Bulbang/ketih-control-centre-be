import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { PeopleRepository } from '@libs/repositories/PeopleRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'
import schema from './schema'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)

const editUser: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    { message: string }
> = async (event) => {
    const { body } = event
    const { id } = event.pathParameters
    await peopleRepository.updateUser(+id, body)

    return { message: 'Updated successfully' }
}

export const main = middyfy(editUser)
