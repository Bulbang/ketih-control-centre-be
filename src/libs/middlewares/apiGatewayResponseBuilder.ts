import middy from '@middy/core'
import { APIGatewayProxyResult } from 'aws-lambda'

export const apiGatewayResponseBuilder = <
    TEvent,
    TResponse extends APIGatewayProxyResult,
>(): middy.MiddlewareObj<TEvent, TResponse> => {
    const after: middy.MiddlewareFn<TEvent, APIGatewayProxyResult> = async (
        handler,
    ) => {
        if (!handler.response.statusCode) {
            const { response } = handler
            handler.response = {
                statusCode: 200,
                body: JSON.stringify(response),
            }
        }
    }

    return {
        after,
    }
}
