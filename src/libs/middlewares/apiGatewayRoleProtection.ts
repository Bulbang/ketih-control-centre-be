import { UserInfo, UserRoles } from '@declarations/db/userinfo'
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
    roles: UserRoles[]
}): middy.MiddlewareObj<TEvent, TResponse> => {
    const before: middy.MiddlewareFn<TEvent, APIGatewayProxyResult> = async (
        handler,
    ) => {
        const user = JSON.parse(
            handler.event.requestContext.authorizer.user,
        ) as UserInfo
        console.log(handler.event.requestContext)
        let access = false

        for (const role of roles)
            if (user[`${AUTH0_CUSTOM_CLAIMS_NAMESPACE}/roles`].includes(role)) {
                access = !access
                break
            }

        if (!access) {
            throw forbidden('Forbidden')
        }
    }

    return {
        before,
    }
}
