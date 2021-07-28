import { adaptExpressRoute } from '@/infra/http'
import { Router } from 'express'
import { makeFacebookLoginController } from '../factories/controllers'

export default (router: Router): void => {
  const controller = makeFacebookLoginController()
  router.post('/api/login/facebook', adaptExpressRoute(controller))
}
