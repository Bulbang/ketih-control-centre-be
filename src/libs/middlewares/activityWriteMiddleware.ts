import { writeActivity } from '@declarations/aws/writeActivity'
import middy from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const activityWriteMiddleware = <
    TEvent extends APIGatewayProxyEvent,
    TResponse extends APIGatewayProxyResult,
>({
    activityType,
    activityDescription,
}: {
    activityType: string
    activityDescription: string
}): middy.MiddlewareObj<TEvent, TResponse> => {
    const after: middy.MiddlewareFn<TEvent, TResponse> = async (handler) => {
        await writeActivity(
            handler.event.requestContext,
            activityType,
            activityDescription,
        )
    }

    return {
        after,
    }
}
