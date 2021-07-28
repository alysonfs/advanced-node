import { env } from '@/main/config/env'

import { ConnectionOptions } from 'typeorm'

export const typeOrmPgConnection: ConnectionOptions = {
  type: 'postgres',
  host: env.pg.host,
  port: parseInt(env.pg.port),
  username: env.pg.username,
  password: env.pg.password,
  database: env.pg.database,
  synchronize: true,
  entities: ['dist/infra/postgres/entities/index.js']
}
