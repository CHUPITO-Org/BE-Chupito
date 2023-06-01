'use strict'

const { MongoClient } = require('mongodb')
const environment = require('../environment')

let client;

module.exports = async () => {
  if (!client) {
    const uri = environment.getEnvironmentVariables().MONGODB_URI
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    try {
      client = await new MongoClient(uri, options).connect()
      console.log('Connected to MongoDB')
      return client.db()
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw new Error('Error connecting to MongoDB')
    }
  }
}
