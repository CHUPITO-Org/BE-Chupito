'use strict'

const { MongoClient } = require('mongodb')
const environment = require('../environment')

let client = null

module.exports = async () => {
  const allEnvironmentVars = environment.getEnvironmentVariables()
  if (!client) {
    const { MONGODB_URI, DEFAULT_DB } = allEnvironmentVars
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    try {
      const client = new MongoClient(MONGODB_URI, options)
      await client.connect()
      console.log('Connected to MongoDB')
      return client.db(DEFAULT_DB)
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw new Error('Error connecting to MongoDB')
    }
  }
}
