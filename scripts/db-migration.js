const { ObjectId, MongoClient } = require('mongodb')
const admin = require('firebase-admin')
const dotenv = require('dotenv')

const environment = require('../environment')

const allEnvironVars = environment.getEnvironmentVariables()
const eventsCollectionName = 'events'
const headquartersCollectionName = 'headquarters'
const usersCollectionName = 'users'

dotenv.config()

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: JSON.parse(`"${process.env.PRIVATE_KEY}"`),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET,
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const fetchFirebaseData = async collectionName => {
  try {
    const snapshot = await admin.firestore().collection(collectionName).get()
    const collectionData = []

    snapshot.forEach(doc => {
      collectionData.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    return collectionData
  } catch (error) {
    console.error('Error fetching headquarters data:', error)
    throw new Error('Error fetching headquarters data')
  }
}

const mapHeadquartersToMongoDBDocument = headquarters => {
  const mappedHeadquarters = headquarters.map(headquarter => {
    const mappedHeadquarter = {
      _id: new ObjectId(headquarter.id.toHexString),
      name: headquarter.name,
    }
    return mappedHeadquarter
  })

  return mappedHeadquarters
}

const mapEventsToMongoDBDocument = (events, mappedheadquarters) => {
  const mappedEvents = events.map(event => {
    const mappedEvent = {
      _id: new ObjectId(event.id.toHexString),
      address: event.address,
      eventDate: event.eventDate,
      name: event.name,
      status: event.status,
      year: event.year,
    }
    if (event.headquarter && typeof event.headquarter === 'object') {
      const headquartersData = mappedheadquarters.find(
        headquarter => headquarter.name === event.headquarter.name
      )
      mappedEvent.headquarter = headquartersData ? headquartersData._id : undefined
    }

    return mappedEvent
  })

  return mappedEvents
}

const mapUserToMongoDBDocument = () => {
  const mappedUser = [
    {
      _id: new ObjectId(),
      email: process.env.TEST_USER_EMAIL,
      firstName: 'Test',
      lastName: 'User',
      isAdmin: false,
      isSuperAdmin: false,
      role: 'user',
      uid: process.env.TEST_USER_ID,
    },
  ]
  return mappedUser
}
const saveToMongoDB = async (data, collectionName) => {
  const { MONGODB_URI, DEFAULT_DB } = allEnvironVars
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  try {
    const mongoClient = new MongoClient(MONGODB_URI, options)
    await mongoClient.connect()

    const db = mongoClient.db(DEFAULT_DB)
    const collection = db.collection(collectionName)

    await collection.insertMany(data)

    const savedCollection = await collection.find({}).toArray()

    await mongoClient.close()

    console.log(collectionName + 'Data saved to MongoDB successfully')

    return savedCollection
  } catch (error) {
    console.error('Error saving data to MongoDB:', error)
    throw new Error('Error saving data to MongoDB')
  }
}

const verifyDataMigration = (mongoCollectionData, firebaseCollectionData) => {
  const hasMatch =
    mongoCollectionData.length === firebaseCollectionData.length &&
    firebaseCollectionData.every(firebaseItem =>
      mongoCollectionData.some(mongoDBItem => mongoDBItem.name === firebaseItem.name)
    )
  console.log('verify -----> ', hasMatch)
  if (!hasMatch) {
    console.error('Collection data mismatch between MongoDB and Firebase')
  }
  return hasMatch
}

const runFullDataMigration = async () => {
  const headquarters = await fetchFirebaseData(headquartersCollectionName)
  const events = await fetchFirebaseData(eventsCollectionName)

  const mappedHeadquarters = mapHeadquartersToMongoDBDocument(headquarters)
  const mappedEvents = mapEventsToMongoDBDocument(events, mappedHeadquarters)
  const mappedUser = mapUserToMongoDBDocument()

  const savedHeadquarters = await saveToMongoDB(mappedHeadquarters, headquartersCollectionName)
  const savedEvents = await saveToMongoDB(mappedEvents, eventsCollectionName)
  const savedUser = await saveToMongoDB(mappedUser, usersCollectionName)

  const headquartesDataMatch = verifyDataMigration(savedHeadquarters, headquarters)
  const eventsDataMatch = verifyDataMigration(savedEvents, events)
  const usersDataMatch = verifyDataMigration(savedUser, mappedUser)

  let verificationMessage = 'Data migration completed with errors'

  if (headquartesDataMatch && eventsDataMatch && usersDataMatch) {
    verificationMessage = 'Data migration process finished'
  }

  console.log(verificationMessage)
}

const runCreateUsersCollection = async () => {
  const mappedUser = mapUserToMongoDBDocument()
  const savedUser = await saveToMongoDB(mappedUser, usersCollectionName)
  const usersDataMatch = verifyDataMigration(savedUser, mappedUser)

  let verificationMessage = 'User collection creation failed'

  if (usersDataMatch) {
    verificationMessage = 'User collection created successfully'
  }
  console.log(verificationMessage)
}

const launch = async () => {
  const createUsers = process.argv.includes('--create-users')
  const migrationType = createUsers ? 'CreateUsersCollection' : 'FullDataMigration'
  await eval(`run${migrationType}()`)
  process.exit()
}

launch()
