const dotenv = require('dotenv')

const DEFAULT_DATABASE = 'mongodb'
const EVENTS_COLLECTION_NAME = 'events'
const HEADQUARTERS_COLLECTION_NAME = 'headquarters'
const USER_ID = 'testuser@chupito.com'
const USER_PWD = 'TesT#975'

dotenv.config()

function getEnvironmentVariables() {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    DEFAULT_DB: DEFAULT_DATABASE,
    EVENTS_COLLECTION: EVENTS_COLLECTION_NAME,
    HEADQUARTERS_COLLECTION: HEADQUARTERS_COLLECTION_NAME,
  }
}

function getFirebaseConfig() {
  return {
    AUTH_PRIVATE_KEY_ID: process.env.AUTH_PRIVATE_KEY_ID,
    AUTH_PRIVATE_KEY:  JSON.parse(`"${process.env.AUTH_PRIVATE_KEY}"`),
    AUTH_CLIENT_EMAIL: process.env.AUTH_CLIENT_EMAIL,
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_CLIENT_X509_CERT_URL: process.env.AUTH_CLIENT_X509_CERT_URL,
    AUTH_PROJECT_ID: process.env.AUTH_PROJECT_ID,
    TEST_USER:USER_ID,
    TEST_PASSWORD: USER_PWD,
  }
}

module.exports = {
  getEnvironmentVariables,
  getFirebaseConfig,
}
