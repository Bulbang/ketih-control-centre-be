import { isBoom } from '@hapi/boom'
import middy from '@middy/core'
import { APIGatewayProxyResult } from 'aws-lambda'

export const apiResponseBuilder = <
    TEvent,
    TResponse extends APIGatewayProxyResult,
>(
    opts?,
): middy.MiddlewareObj<TEvent, TResponse> => {
    const defaults = {
        logger: console.error,
    }

    const options = Object.assign({}, defaults, opts)
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
    const onError: middy.MiddlewareFn<TEvent, TResponse> = async (handler) => {
        const { error } = handler
        if (typeof options.logger === 'function') {
            await options.logger(JSON.stringify(error))
        }

        if (isBoom(error)) {
            const { statusCode, payload: errorPayload } = error.output
            handler.response = Object.assign({}, handler.response, {
                statusCode,
                body: JSON.stringify(errorPayload.message),
            })
        } else {
            handler.response = Object.assign({}, handler.response, {
                statusCode: 500,
                body: JSON.stringify(error.message),
            })
        }
    }
    return {
        onError,
        after,
    }
}
