import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import getAuth0Instance from '@libs/utils/Auth0Instance'

type LambdaReturn = {
    statistic: {
        total: number
        active: number
    }
}

const getStatistic: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    const Auth0Instance = await getAuth0Instance()
    const stats = await Auth0Instance.getStats()
    return {
        statistic: stats,
    }
}

export const main = middyfy(getStatistic)
