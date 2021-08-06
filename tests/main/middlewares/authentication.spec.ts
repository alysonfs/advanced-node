
import { ForbiddenError } from '@/application/errors'
import { auth } from '@/main/middlewares'
import { app } from '@/main/config/app'

import request from 'supertest'

describe('Authentication Middleware', () => {
  it('Should return 403 if authorization header wall not provided', async () => {
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals)
    })

    const { status, body } = await request(app).get('/fake_route')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })
})
