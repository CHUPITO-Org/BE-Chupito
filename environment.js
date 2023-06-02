const DEFAULT_DATABASE = 'mongodb'

function getEnvironmentVariables() {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    DEFAULT_DB: DEFAULT_DATABASE,
  }
}

module.exports = {
  getEnvironmentVariables,
}
