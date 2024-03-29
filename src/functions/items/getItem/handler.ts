import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { ItemDetailRepository } from '@libs/repositories/mysql/ItemDetailRepository'
import { notFound } from '@hapi/boom'

const db = createDbConnection()
const itemDetailRepository = new ItemDetailRepository(db)

type LambdaReturn = {
    device_make: string
    device_model: string
    device_status: string
    device_serial_number: string
}

const getItem: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { serial_number } = event.pathParameters

    const [item] = await itemDetailRepository.getItem(serial_number)

    if (!item) {
        throw notFound(`Item with serial number ${serial_number} not found`)
    }

    return item
}

export const main = middyfy(getItem)
