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
    PRIVATE_KEY_ID: process.env.AUTH_PRIVATE_KEY_ID,
    PRIVATE_KEY: JSON.parse(`"${process.env.AUTH_PRIVATE_KEY}"`),
    CLIENT_EMAIL: process.env.AUTH_CLIENT_EMAIL,
    CLIENT_ID: process.env.AUTH_CLIENT_ID,
    CLIENT_X509_CERT_URL: process.env.AUTH_CLIENT_X509_CERT_URL,
    PROJECT_ID: process.env.AUTH_PROJECT_ID,
    API_KEY: process.env.AUTH_API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    STORAGE_BUCKET: process.env.AUTH_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.AUTH_MESSAGING_SENDER_ID,
    APP_ID: process.env.AUTH_APP_ID,
    MEASUREMENT_ID: process.env.AUTH_MEASUREMENT_ID,
    TEST_EMAIL: USER_ID,
    TEST_PASSWORD: USER_PWD,
  }
}

module.exports = {
  getEnvironmentVariables,
  getFirebaseConfig,
}
