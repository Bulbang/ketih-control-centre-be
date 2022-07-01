import middy from '@middy/core'
import { APIGatewayProxyResult } from 'aws-lambda'

export const apiGatewayResponseBuilder = <
    TEvent,
    TResponse extends APIGatewayProxyResult,
>(): middy.MiddlewareObj<TEvent, TResponse> => {
    const after: middy.MiddlewareFn<TEvent, APIGatewayProxyResult> = async (
        handler,
    ) => {
        const { response } = handler
        handler.response = response
            ? {
                  statusCode: 200,
                  body: JSON.stringify({
                      status: 'OK',
                      data: response,
                  }),
              }
            : {
                  statusCode: 200,
                  body: JSON.stringify({
                      status: 'OK',
                  }),
              }
    }

    return {
        after,
    }
}
