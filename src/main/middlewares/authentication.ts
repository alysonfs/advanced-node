import { adapterExpressMiddleware } from '@/main/adapters'
import { makeAuthenticationMiddleware } from '../factories/middlewares'

export const auth = adapterExpressMiddleware(makeAuthenticationMiddleware())
