import { isBoom } from '@hapi/boom'
import middy from '@middy/core'
import { APIGatewayProxyResult } from 'aws-lambda'

export const apiGatewayErrorHandler = <
    TEvent,
    TResponse extends APIGatewayProxyResult,
>(
    opts?,
): middy.MiddlewareObj<TEvent, TResponse> => {
    const defaults = {
        logger: console.error,
    }

    const options = Object.assign({}, defaults, opts)
    const onError: middy.MiddlewareFn<TEvent, TResponse> = async (handler) => {
        const { error } = handler
        if (typeof options.logger === 'function') {
            await options.logger(error)
        }

        if (isBoom(error)) {
            const { statusCode, payload: errorPayload } = error.output
            handler.response = Object.assign({}, handler.response, {
                statusCode,
                body: JSON.stringify({
                    status: 'ERROR',
                    data: { message: errorPayload.message },
                }),
            })
        } else {
            handler.response = Object.assign({}, handler.response, {
                statusCode: 500,
                body: JSON.stringify({
                    status: 'ERROR',
                    data: { message: error.message },
                }),
            })
        }
    }
    return {
        onError,
    }
}
