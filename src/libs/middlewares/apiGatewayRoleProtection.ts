import { UserInfo } from '@declarations/db/userinfo'
import { forbidden } from '@hapi/boom'
import middy from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const { AUTH0_CUSTOM_CLAIMS_NAMESPACE } = process.env

export const apiGatewayRoleProtection = <
    TEvent extends APIGatewayProxyEvent,
    TResponse extends APIGatewayProxyResult,
>({
    roles,
}: {
    roles: string[]
}): middy.MiddlewareObj<TEvent, TResponse> => {
    const before: middy.MiddlewareFn<TEvent, APIGatewayProxyResult> = async (
        handler,
    ) => {
        const user = JSON.parse(
            handler.event.requestContext.authorizer.user,
        ) as UserInfo
        console.log(handler.event.requestContext)

        for (const role of roles)
            if (!user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/roles`].includes(role))
                throw forbidden('Forbidden')
    }

    return {
        before,
    }
}
