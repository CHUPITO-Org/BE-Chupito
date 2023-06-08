const { ObjectId, MongoClient } = require('mongodb')

const serviceContainer = require('../services/service.container')
const environment = require('../environment')

const allEnvironVars = environment.getEnvironmentVariables()

const launch = async () => {
  const headquartersService = await serviceContainer('headquarters')
  const eventsService = await serviceContainer('events')

  const headquarters = await headquartersService.doList()

  const eventParameters = {}

  const events = await eventsService.doList(eventParameters)

  const mappedHeadquarters = mapHeadquartersToMongoDBDocument(headquarters)
  const mappedEvents = mapEventsToMongoDBDocument(events, mappedHeadquarters)

  const savedHeadquarters = await saveToMongoDB(
    mappedHeadquarters,
    allEnvironVars.HEADQUARTERS_COLLECTION
  )
  const savedEvents = await saveToMongoDB(mappedEvents, allEnvironVars.EVENTS_COLLECTION)

  const headquartesDataMatch = verifyDataMigration(savedHeadquarters, headquarters.data)
  const eventsDataMatch = verifyDataMigration(savedEvents, events.data)

  const verificationMessage =
    headquartesDataMatch && eventsDataMatch
      ? 'Data migration process finished'
      : 'Data migration completed with errors'

  console.log(verificationMessage)
  process.exit()
}

launch()

const mapHeadquartersToMongoDBDocument = headquarters => {
  const mappedHeadquarters = headquarters.data.map(headquarter => {
    const mappedHeadquarter = {
      _id: new ObjectId(headquarter.id.toHexString),
      name: headquarter.name,
    }
    return mappedHeadquarter
  })

  return mappedHeadquarters
}

const mapEventsToMongoDBDocument = (events, mappedheadquarters) => {
  const mappedEvents = events.data.map(event => {
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

    await db.createCollection(collectionName)
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
  if (!hasMatch) {
    console.error('Collection data mismatch between MongoDB and Firebase')
  }
  return hasMatch
}
