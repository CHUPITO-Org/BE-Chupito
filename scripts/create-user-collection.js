/**
 * Script to create a 'User' collection in MongoDB and insert a specific user for test purposes
 * This script connects to a MongoDB database, creates the 'User' collection if it doesn't exist,
 * and inserts a specific test user into the collection.
 */

const { ObjectId, MongoClient } = require('mongodb')
const dotenv = require('dotenv')

dotenv.config()

const launch = async () => {
  try {
    await saveUserToMongoDB()

    console.log('Create Users Collection process finished')
    process.exit()
  } catch (error) {
    console.error('Create Users Collection completed with errors:', error)
  }
}

const saveUserToMongoDB = async () => {
  const mappedUser = mapUserToMongoDBDocument()

  try {
    const { MONGODB_URI } = process.env

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    const mongoClient = new MongoClient(MONGODB_URI, options)
    await mongoClient.connect()

    const db = mongoClient.db()
    const collection = db.collection('users')

    await db.createCollection('users')
    await collection.insertOne(mappedUser)

    const savedUser = await collection.find({}).toArray()

    await mongoClient.close()

    console.log('User saved to MongoDB successfully')
    console.log(savedUser)
  } catch (error) {
    console.error('Error saving user to MongoDB:', error)
    throw new Error('Error saving user to MongoDB')
  }
}

const mapUserToMongoDBDocument = () => {
  const mappedUser = {
    _id: new ObjectId(),
    email: process.env.TEST_USER_EMAIL,
    firstName: 'Test',
    lastName: 'User',
    isAdmin: false,
    isSuperAdmin: false,
    role: 'user',
    uid: process.env.TEST_USER_ID,
  }
  return mappedUser
}

launch()
