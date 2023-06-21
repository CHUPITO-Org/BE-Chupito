const dotenv = require('dotenv')

const DEFAULT_DATABASE = 'mongodb'

// TODO: These should be removed because they are NOT environment variables
const EVENTS_COLLECTION_NAME = 'events'
const HEADQUARTERS_COLLECTION_NAME = 'headquarters'
const APP_DB = 'mongodb'

dotenv.config()

function getEnvironmentVariables() {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    DEFAULT_DB: DEFAULT_DATABASE,
    EVENTS_COLLECTION: EVENTS_COLLECTION_NAME,
    HEADQUARTERS_COLLECTION: HEADQUARTERS_COLLECTION_NAME,
    APP_DB,
  }
}

module.exports = {
  getEnvironmentVariables,
}
