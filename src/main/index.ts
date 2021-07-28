import './config/module-alias'
import { app, env, typeOrmPgConnection } from '@/main/config'

import 'reflect-metadata'
import { createConnection } from 'typeorm'

createConnection(typeOrmPgConnection)
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server runnig at http://localhost:${env.port}`)
    })
  })
  .catch(console.error)
