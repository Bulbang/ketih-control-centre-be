import type {
    APIGatewayProxyEvent,
    Handler,
} from 'aws-lambda'
import type { FromSchema } from 'json-schema-to-ts'

type ValidatedAPIGatewayProxyEvent<TSchema> = Omit<APIGatewayProxyEvent, 'body'> & {
    body: FromSchema<TSchema>
}
export type ValidatedEventAPIGatewayProxyEvent<TSchema, TResult> = Handler<
    ValidatedAPIGatewayProxyEvent<TSchema>,
    TResult
>

export const formatJSONResponse = (response: Record<string, unknown>) => {
    return {
        statusCode: 200,
        body: JSON.stringify(response),
    }
}
