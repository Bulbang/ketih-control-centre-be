import { handlerPath } from '@libs/utils/handler-resolver'
import { LambdaConfig } from '@declarations/aws/funcs'

const writeActivity: LambdaConfig = {
    handler: handlerPath(__dirname) + '/handler.main',
}

export default writeActivity
