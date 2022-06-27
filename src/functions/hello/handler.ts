import type { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
// import { badRequest } from '@hapi/boom'
import { middyfy } from '@libs/middlewares/middyfy'
import schema from './schema'

const hello: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    { message: string }
> = async (event) => {
    // throw badRequest('Error handling test')
    return {
        message: `Hello World!`,
        eventBody: event.body,
    }
}

export const main = middyfy(hello)
