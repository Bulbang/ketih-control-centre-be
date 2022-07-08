import { middyfy } from '@libs/middlewares/middyfy'
import { ValidatedEventAPIGatewayProxyEvent } from '@declarations/aws/api-gateway'

type LambdaReturn = {
    peripherals: {
        type: string
        model: string
        deployed: number
        in_stock: number
    }[]
    total: number
}

const getPeripherals: ValidatedEventAPIGatewayProxyEvent<
    undefined,
    LambdaReturn
> = async (_) => {
    return {
        peripherals: [
            {
                type: 'Monitor',
                model: 'HP E27m',
                deployed: Math.round(Math.random() * 100),
                in_stock: Math.round(Math.random() * 100),
            },
            {
                type: 'Headset',
                model: 'Jabra Pro 920',
                deployed: Math.round(Math.random() * 100),
                in_stock: Math.round(Math.random() * 100),
            },
            {
                type: 'Mouse',
                model: 'Logitech G102',
                deployed: Math.round(Math.random() * 100),
                in_stock: Math.round(Math.random() * 100),
            },
            {
                type: 'Keyboard',
                model: 'Logitech K360',
                deployed: Math.round(Math.random() * 100),
                in_stock: Math.round(Math.random() * 100),
            },
        ],
        total: Math.round(Math.random() * 10000),
    }
}

export const main = middyfy(getPeripherals)
