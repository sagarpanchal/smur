module.exports = {
  port: 8080,
  env: process.env.NODE_ENV,
  companyName: 'COMPANY',
  appName: 'APP',
  publicUrl: 'https://localhost',
  redis: { db: 'redis://localhost:6379/' },
  mongodb: {
    db: 'mongodb://localhost:27017/tempDb',
    options: {
      connectTimeoutMS: 30000,
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  mongoose: { useCreateIndex: true, useFindAndModify: false },
  apiDocs: false,
  logger: ['json'],
  mailFrom: 'no-reply@localhost',
  mailer: { host: '', port: 0, auth: { user: '', pass: '' } },
  aws: {
    config: { accessKeyId: '', secretAccessKey: '', sessionToken: '' },
    buckets: { default: 'defaultcdn' },
  },
}
