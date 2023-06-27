'use strict'

const { ObjectId } = require('mongodb')

const BaseService = require('./base.service')
const environmentVars = require('../environment')

class EventsService extends BaseService {
  constructor(dbInstance) {
    super()
    this.collection = dbInstance.collection('events')
    this.recrutingEventType = 'recruiting'
    this.salesEventType = 'sales'
    this.eventCreatedStatus = 'created'
  }

  async create(data) {
    let newEvent = null
    let response

    try {
      data.status = this.eventCreatedStatus
      newEvent = data
      newEvent.year = new Date(data.date).getFullYear()
      let newEventRef = await this.collection.add(data)
      newEvent.id = newEventRef.id
      // TODO: Create a constants object and replace this message
      const successMessage = 'Event was successfully created.'
      response = this.getSuccessResponse(newEvent, successMessage)
    } catch (err) {
      const errorMessage = 'Error adding a event'
      /* eslint-disable no-console */
      // console.error('Error creating an event: ', err)
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
    }

    return response
  }

  async doList(eventParams) {
    const { APP_DB, DEFAULT_DB } = environmentVars.getEnvironmentVariables()

    try {
      const dataSnapshot =
        APP_DB === DEFAULT_DB
          ? await this.doListFromMongo(eventParams)
          : await this.doListFromFirebase(eventParams)

      return this.getSuccessResponse(dataSnapshot, 'Getting all events successfully')
    } catch (err) {
      return this.getErrorResponse('Error getting all events')
    }
  }

  async getEventData(id) {
    const dataSnapshot = await this.collection.doc(id).get()

    if (!dataSnapshot.exists) {
      throw new Error(`Event ${id} not found`)
    }
    const event = dataSnapshot.data()

    if (!event.eventType) {
      event.eventType = this.recrutingEventType
    }

    return event
  }

  async findById(id) {
    const { APP_DB, DEFAULT_DB } = environmentVars.getEnvironmentVariables()
    let response
    try {
      if (!id) throw new Error(`id is necessary`)
      const event =
        APP_DB === DEFAULT_DB ? await this.findByIdFromMongo(id) : await this.getEventData(id)

      event.id = id
      response = this.getSuccessResponse(event, 'Getting event information successfully')
    } catch (err) {
      response = this.getErrorResponse(`Error getting event information: ${err.message}`)
    }

    return response
  }

  filteredEventImages(event, deletedImages) {
    if (!event.images || (event.images && event.images.length === 0)) {
      return []
    }

    let filteredImages = []
    event.image.forEach(eventImage => {
      if (!deletedImages.some(image => eventImage.id === image)) {
        filteredImages.push(eventImage)
      }
    })

    return filteredImages
  }

  async update(id, data) {
    let eventData = null
    let deletedImages = []
    let response

    data.year = new Date(data.date).getFullYear()

    if (data.deletedImages) {
      deletedImages = data.deletedImages
      delete data.deletedImages
    }

    try {
      if (deletedImages.length > 0) {
        const existingEventData = await this.getEventData(id)
        // TODO: Implement here a call for removing image in firebase storage
        data.images = this.filteredEventImages(existingEventData, deletedImages)
      }

      await this.collection.doc(id).update(data)

      let eventRef = await this.collection.doc(id).get()

      eventData = {
        id: id,
        ...eventRef.data(),
      }

      const successMessage = 'Event was updated successfully'
      response = this.getSuccessResponse(eventData, successMessage)
    } catch (err) {
      const errorMessage = 'Error updating event information'
      /* eslint-disable no-console */
      // console.error(errorMessage, err)
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
    }

    return response
  }

  async updateImages(id, images) {
    try {
      const dataSnapshot = await this.collection.doc(id).get()

      const event = dataSnapshot.exists ? dataSnapshot.data() : null

      if (!event) throw "Event doesn't exits"

      event.id = id

      if (!event.images) {
        event.images = []
      }

      images.forEach(({ id, url }) => event.images.push({ id, url }))

      await this.collection.doc(id).update(event)

      return this.getSuccessResponse(event, 'Images updated successfully')
    } catch (err) {
      /* eslint-disable no-console */
      /* eslint-enable */
      return this.getErrorResponse('Error updating event images information')
    }
  }

  async deleteImage(id, idImage) {
    let event = null

    try {
      const dataSnapshot = await this.collection.doc(id).get()

      event = dataSnapshot.exists ? dataSnapshot.data() : null

      if (!event) {
        throw new Error({ message: `The event id ${id} was not found` })
      }

      event.id = id

      const imageIndex = event.images.findIndex(({ id }) => {
        return id === idImage
      })

      if (imageIndex < 0) {
        throw new Error({ message: `The image id ${id} was not found` })
      }

      event.images.splice(imageIndex, 1)

      await this.collection.doc(id).update(event)

      return this.getSuccessResponse(event, 'Updated images successfully')
    } catch (err) {
      /* eslint-disable no-console */
      // console.error(errorMessage, err)
      /* eslint-enable */
      return this.getErrorResponse('Error updating event images information')
    }
  }

  async open(id) {
    return await this.setStatus(id, 'opened')
  }

  async pause(id) {
    return await this.setStatus(id, 'paused')
  }

  async close(id) {
    return await this.setStatus(id, 'closed')
  }

  async setStatus(id, status) {
    let response

    try {
      const dataSnapshot = await this.collection.doc(id).get()

      const event = dataSnapshot.exists ? dataSnapshot.data() : null

      if (!event) {
        throw new Error({ message: `The event id ${id} was not found` })
      }

      event.id = id
      event.status = status

      await this.collection.doc(id).update(event)

      // TODO: Create a constants object and replace this message
      const successMessage = 'Event status changed succesfully'
      response = this.getSuccessResponse(event, successMessage)
    } catch (err) {
      // TODO: Create a constants object and replace this message
      const errorMessage = "Error while changing event's status"
      /* eslint-disable no-console */
      // console.error(errorMessage, err);
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
    }

    return response
  }

  async addAttendees(id, idAttendees) {
    let response

    try {
      const dataSnapshot = await this.findById(id)
      const event = dataSnapshot ? dataSnapshot.data : null

      if (!event) {
        throw new Error({ message: `The event id ${id} was not found` })
      }

      if (!event.attendees) {
        event.attendees = []
      }

      const addedIndex = event.attendees.findIndex(addedAttendee => {
        return addedAttendee === idAttendees
      })

      if (addedIndex < 0) {
        event.attendees.push(idAttendees)
      }

      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { attendees: event.attendees } }
      )

      response = this.getSuccessResponse(event, 'Attendees added succesfully')
    } catch (err) {
      response = this.getErrorResponse('Error while adding attendees to event')
    }
    return response
  }

  async remove(id) {
    let response
    try {
      await this.collection.doc(id).delete()
      const successMessage = 'Event successfully deleted'
      response = this.getSuccessResponse({}, successMessage)
    } catch (err) {
      const errorMessage = 'Error removing event'
      /* eslint-disable no-console */
      // console.error(errorMessage, err);
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
    }

    return response
  }

  async doListFromFirebase(eventParams) {
    let allEvents = []

    const { year, withAttendees, headquarterId, showAllStatus } = eventParams

    let rootQuery = this.collection
    try {
      if (year) {
        rootQuery = rootQuery.where('year', '==', parseInt(year, 10))
      }

      if (headquarterId) {
        rootQuery = rootQuery.where('headquarter.id', '==', headquarterId)
      }

      const dataSnapshot = await rootQuery.get()

      dataSnapshot.forEach(doc => {
        const event = {
          id: doc.id,
          ...doc.data(),
        }

        if (showAllStatus || event.status !== 'closed') {
          if ((event.attendees && event.attendees.length > 0) || !withAttendees) {
            allEvents.push(event)
          }
        }
      })

      return allEvents
    } catch (err) {
      return this.getErrorResponse('Error getting all events')
    }
  }

  async doListFromMongo(eventParams) {
    try {
      const queryEvents = {}

      const { year, headquarterId } = eventParams

      if (year) {
        queryEvents['year'] = parseInt(year, 10)
      }

      if (headquarterId) {
        queryEvents['headquarter'] = new ObjectId(headquarterId)
      }

      const data = await this.collection.find(queryEvents).toArray()

      // TODO: colocar estructura
      return data
    } catch (error) {
      return error
    }
  }

  async findByIdFromMongo(id) {
    const data = await this.collection.findOne({ _id: new ObjectId(id) })

    if (!data) {
      throw new Error(`Event ${id} not found`)
    }
    return data
  }
}

module.exports = EventsService
