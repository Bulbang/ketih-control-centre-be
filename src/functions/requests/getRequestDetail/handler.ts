import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'

const db = createDbConnection()
const workOrderRepository = new WorkOrderRepository(db)

type LambdaReturn = {
    work_order_id: number
    // requsetor: string
    runbook: string
    events: number[]
    incidents: number[]
    notes: string[]
}

const getRequestDetail: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const { id } = event.pathParameters
    const orders = await workOrderRepository.getRequestDetail(+id)

    return {
        work_order_id: orders[0].work_order_id,
        // requsetor: orders[0].requestor,
        runbook: orders[0].runbook,
        events: orders.map((order) => order.event_id),
        incidents: orders
            .map((order) => order.incident_id)
            .filter((val) => val),
        notes: orders.map((order) => order.notes).filter((val) => val),
    }
}

export const main = middyfy(getRequestDetail)
