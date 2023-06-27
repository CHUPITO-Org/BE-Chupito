const dotenv = require('dotenv')

const DEFAULT_DATABASE = 'mongodb'

// TODO: These should be removed because they are NOT environment variables
const APP_DB = 'mongodb'

dotenv.config()

function getEnvironmentVariables() {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    DEFAULT_DB: DEFAULT_DATABASE,
    APP_DB,
  }
}

module.exports = {
  getEnvironmentVariables,
}
