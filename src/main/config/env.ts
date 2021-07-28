export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '5837217246348179',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'ccc497fc50d38511d83bc95050c93d4d'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'aDeAmor',
  pg: {
    host: process.env.PG_HOST ?? 'localhost',
    port: process.env.PG_PORT ?? '5432',
    username: process.env.PG_USER ?? 'postgres',
    password: process.env.PG_PASSWORD ?? 'postgres',
    database: process.env.PG_DATABASE ?? 'advancednode'
  }
}
