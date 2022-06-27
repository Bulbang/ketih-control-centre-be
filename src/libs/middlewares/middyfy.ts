import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import { Handler } from 'aws-lambda'
import { apiGatewayResponseBuilder } from './apiGatewayResponseBuilder'
import { apiGatewayErrorHandler } from './apiResponseBuilder'

export const middyfy = (handler: Handler) => {
    return middy(handler)
        .use(middyJsonBodyParser())
        .use(doNotWaitForEmptyEventLoop())
        .use(httpEventNormalizer())
        .use(httpHeaderNormalizer())
        .use(apiGatewayErrorHandler())
        .use(apiGatewayResponseBuilder())
}
