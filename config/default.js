module.exports = {
  env: process.env.NODE_ENV,
  port: 8080,
  tls: false,
  ssl: { cert: '', key: '' },
  corsOrigins: [],
  appName: 'APP',
  companyName: 'COMPANY',
  publicUrl: 'http://localhost:3000',
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
  mongoose: {
    useCreateIndex: true,
    useFindAndModify: false,
  },
  timezone: 'Asia/Kolkata',
  locale: 'en-IN',
  apiDocs: false,
  logger: ['json'],
  mailFrom: 'no-reply@localhost',
  mailer: {
    host: '',
    port: 0,
    auth: {
      user: '',
      pass: '',
    },
  },
  oAuth2: {
    facebook: {
      clientID: '',
      clientSecret: '',
      profileFields: ['id', 'first_name', 'last_name', 'emails', 'picture'],
      scope: ['email'],
    },
    google: {
      clientID: '',
      clientSecret: '',
      scope: ['profile', 'email'],
    },
  },
  aws: {
    config: {
      accessKeyId: '',
      secretAccessKey: '',
      sessionToken: '',
    },
    buckets: {
      default: 'defaultcdn',
    },
  },
}
