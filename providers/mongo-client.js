'use strict'

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let client = null;

module.exports = async () => {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    client = new MongoClient(uri, options);

    try {
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  return client.db();
};
