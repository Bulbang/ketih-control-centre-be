import type { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { middyfy } from '@libs/middlewares/middyfy'
import schema from './schema'

const hello: ValidatedEventAPIGatewayProxyEvent<
    typeof schema,
    { message: string }
> = async (event) => {
    return {
        message: `Hello World!`,
        eventBody: event.body,
    }
}

export const main = middyfy(hello)
