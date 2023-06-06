const DEFAULT_DATABASE = 'mongodb'
const EVENTS_COLLECTION_NAME = 'events'
const HEADQUARTERS_COLLECTION_NAME = 'headquarters'

function getEnvironmentVariables() {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    DEFAULT_DB: DEFAULT_DATABASE,
    EVENTS_COLLECTION: EVENTS_COLLECTION_NAME,
    HEADQUARTERS_COLLECTION: HEADQUARTERS_COLLECTION_NAME
  }
}

module.exports = {
  getEnvironmentVariables,
}
