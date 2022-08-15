// import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'
// import { IncidentRepository } from '@libs/repositories/mysql/IncidentRepository'
// import { EventRepository } from '@libs/repositories/mysql/EventRepository'
// import { ItemDetailRepository } from '@libs/repositories/mysql/ItemDetailRepository'
// import { EventRepository } from '@libs/repositories/mysql/EventRepository'
import { WorkOrderRepository } from '@libs/repositories/mysql/WorkOrderRepository'
// import { V_eventRepository } from '@libs/repositories/mysql/V_eventRepository'
// import Auth0Instance from '@libs/utils/Auth0Instance'
import { createDbConnection } from '@libs/utils/createDbConnection'
import { writeFileSync } from 'fs'

const db = createDbConnection()
const rep = new WorkOrderRepository(db)
rep
// const incidentRepository = new IncidentRepository(db)
// const workOrderRepository = new WorkOrderRepository(db)

const main = async () => {
    console.time('Timer')
    const data = await rep.getReqsByActionDateAndDeliveryStatus()

    const dates = [...new Set(data.map((item) => item.action_date))]
    const res: {
        [date: string]: { status: string; total: number }[]
    } = {}

    dates.forEach((date) => {
        res[date.toISOString().split('T')[0]] = data
            .filter((item) => `${item.action_date}` == `${date}`)
            .map((item) => {
                return { status: item.statuses[0], total: item.statuses.length }
            })
    })

    console.timeEnd('Timer')
    console.log(res)
    const str = JSON.stringify(res)
    // console.log(str)

    writeFileSync(`${__dirname}/res.json`, str)
}

main()
