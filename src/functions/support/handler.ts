import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'

type LambdaReturn = {
    subject: string
    desc: string
    status: 'inactive' | 'active'
    date: string
    type: 'issue' | 'request' | 'feedback'
}[]

const getSupport: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (event) => {
    const status =
        event.queryStringParameters.status == 'active' ||
        event.queryStringParameters.status == 'inactive'
            ? event.queryStringParameters.status
            : 'active'
    const date = new Date()
    let hours = date.getHours()
    let minutes = `${date.getMinutes()}`
    let ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = +minutes < 10 ? '0' + minutes : minutes
    let strTime = hours + ':' + minutes + ' ' + ampm
    return [
        {
            subject: 'Lorem ipsum',
            desc: 'ASDSDadsasdassssssasdasdasd',
            status,
            type: 'feedback',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
        {
            subject: 'ipsum',
            desc: 'ASDSDadsasdfvdassssssasdasdasd',
            status,
            type: 'issue',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
        {
            subject: 'Lorem ',
            desc: 'ASDSDadsabvcxzsdassssssasdasdasd',
            status,
            type: 'request',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
        {
            subject: 'Lorem ipsum',
            desc: 'ASDSDadsasgfdsdfghgfdsdfghgfdsdfgfdsdassssssasdasdasd',
            status,
            type: 'feedback',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
        {
            subject: 'Lorem ipsum',
            desc: 'ASssssssasdasdasd',
            status,
            type: 'feedback',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
        {
            subject: 'Lorem ipsum',
            desc: 'Aasdasdasdasdadssssssasdasdasd',
            status,
            type: 'request',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
        {
            subject: 'Lorem ipsum',
            desc: 'ASDkadkshgfsldaasdaddassssssasdasdasd',
            status,
            type: 'request',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
        {
            subject: 'Lorem ipsum',
            desc: 'asfsdsgdjoasjkdakf',
            status,
            type: 'issue',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
        {
            subject: 'Lorem ipsum',
            desc: 'bgkvfdlsa;efjqwpiefj',
            status,
            type: 'issue',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
        {
            subject: 'Lorem ipsum',
            desc: 'wqeo ghwnraoegfkjWPOEODJ',
            status,
            type: 'feedback',
            date: `${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()} - ${strTime}`,
        },
    ]
}

export const main = middyfy(getSupport)
