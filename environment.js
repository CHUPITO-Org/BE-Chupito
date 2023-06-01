const os = require('os')

const DEFAULT_DATABASE = 'mongodb'

function getEnvironmentVariables() {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
  }
}

module.exports = {
  getEnvironmentVariables,
}
