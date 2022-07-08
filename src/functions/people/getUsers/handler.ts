import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import { PeopleRepository } from '@libs/repositories/PeopleRepository'
import { createDbConnection } from '@libs/utils/createDbConnection'

const db = createDbConnection()
const peopleRepository = new PeopleRepository(db)

type LambdaReturn = {
    users: {
        people_id: number
        first_name: string
        last_name: string
        phone_number_mobile: string
        phone_number_home: string
        status: string
        business_unit: string
        position_title: string
        email_address_home: string
        email_address_work: string
        country_name: string
    }[]
}

const getUsers: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { page, perPage } = event.queryStringParameters as {
        page?: number
        perPage?: number
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
