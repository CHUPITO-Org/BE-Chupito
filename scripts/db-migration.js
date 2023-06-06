const { ObjectId } = require('mongodb');

const setupMongoDB = require('../providers/mongo-client')
const serviceContainer = require('../services/service.container')
const mongoClient = require('../providers/mongo-client')
const environment = require('../environment')

const allEnvironVars = environment.getEnvironmentVariables()

//TODO:
// Function to fetch data from Firebase

// Functions to map Firebase Events and headquarters data to MongoDB document structure

// Function to save data to MongoDB
const saveToMongoDB = async (data, collectionName) => {
    try {
    const MongoClient = await setupMongoDB()
    const db = MongoClient.db(allEnvironVars.DEFAULT_DB)
    const collection = db.collection(collectionName)
    
    await db.createCollection(collectionName)
    await collection.insertMany(data)
    await MongoClient.close()

    console.log(collectionName + 'Data saved to MongoDB successfully')
  } catch (error) {
    console.error('Error saving data to MongoDB:', error)
    throw new Error('Error saving data to MongoDB')
  }
}

// Main function to perform the data migration
//// Fetch data from Firebase
//// Map Firebase data to MongoDB document structure
//// Save the data to MongoDB
//// Close Firebase connection
//// Close MongoDB connection

// Run the data migration
