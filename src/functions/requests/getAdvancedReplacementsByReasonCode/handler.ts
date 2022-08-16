import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    top_reason_codes: {
        name: string
        total: number
    }[]
    other: number
    total: number
}

const getAdvancedReplacementsByReasonCode: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { interval } = event.queryStringParameters as {
        interval?: string
    }

    const reqsByReasonCode =
        (await workOrderRepository.getAdvancedReplacementsByReasonCode({
            last: interval ? +interval : undefined,
        })) as {
            name: string
            total: number
        }[]

    const total = reqsByReasonCode.reduce((counter, asset) => {
        const totalByMake = asset.total as number
        return totalByMake + counter
    }, 0)
    const top_reason_codes = reqsByReasonCode
        .filter((code) => code.name != null)
        .splice(0, 6)
    const other =
        total -
        top_reason_codes.reduce((counter, asset) => {
            const totalByMake = asset.total as number
            return totalByMake + counter
        }, 0)

    return {
        total,
        other,
        top_reason_codes: top_reason_codes,
    }
}

export const main = middyfy(getAdvancedReplacementsByReasonCode)
