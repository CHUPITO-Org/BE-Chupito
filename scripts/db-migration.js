const { ObjectId } = require('mongodb');

const setupMongoDB = require('../providers/mongo-client')
const serviceContainer = require('../services/service.container')

const launch = async () => {
  const headquartersService = await serviceContainer('headquarters')
  const eventsService = await serviceContainer('events')

  const headquarters = await headquartersService.doList()

  const eventParameters = {}

  const events = await eventsService.doList(eventParameters)

  const mappedHeadquarters = mapHeadquartersToMongoDBDocument(headquarters)
  const mappedEvents = mapEventsToMongoDBDocument(events, mappedHeadquarters)
}

launch()

const mapHeadquartersToMongoDBDocument = headquarters => {
  const mappedHeadquarters = headquarters.data.map(headquarter => {
    const mappedHeadquarter = {
        _id: new ObjectId((headquarter.id).toHexString),
        name: headquarter.name,
    }
    return mappedHeadquarter
  })
  
  return mappedHeadquarters
}
const mapEventsToMongoDBDocument = (events, mappedheadquarters) => {
  const mappedEvents = events.data.map(event => {
    const mappedEvent = {
      _id: new ObjectId((event.id).toHexString),
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
      mappedEvent.headquarter = headquartersData ? headquartersData._id : undefined;
    }

    return mappedEvent
  })

  return mappedEvents
}

// TODO:
// Function to save data to MongoDB

// Main function to perform the data migration
//// Fetch data from Firebase
//// Map Firebase data to MongoDB document structure
//// Save the data to MongoDB
//// Close Firebase connection
//// Close MongoDB connection

// Run the data migration
