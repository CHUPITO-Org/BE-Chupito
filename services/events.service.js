'use strict'

const BaseService = require('./base.service')

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
    let allEvents = []
    let response

    const { year, withAttendees, headquarterId, showAllStatus } = eventParams

    try {
      let rootQuery = this.collection

      if (year) {
        rootQuery.where('year', '==', parseInt(year, 10))
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

      // TODO: Create a constants object and replace this message
      const successMessage = 'Getting all events successfully'
      response = this.getSuccessResponse(allEvents, successMessage)
    } catch (err) {
      const errorMessage = 'Error getting all events'
      /* eslint-disable no-console */
      // console.error(errorMessage, err)
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
    }

    return response
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
    let event = null
    let response

    try {
      event = await this.getEventData(id)
      event.id = id

      // TODO: Create a constants object and replace this message
      const successMessage = 'Getting event information successfully'
      response = this.getSuccessResponse(event, successMessage)
    } catch (err) {
      const errorMessage = `Error getting event ${id} information`
      /* eslint-disable no-console */
      // console.error(errorMessage, err);
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
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

  async addAttendees(id, attendees) {
    let response

    try {
      let dataSnapshot = await this.collection.doc(id).get()

      const event = dataSnapshot.exists ? dataSnapshot.data() : null

      if (!event) {
        throw new Error({ message: `The event id ${id} was not found` })
      }

      if (!event.attendees) {
        event.attendees = []
      }

      attendees.map(attendee => {
        const addedIndex = event.attendees.findIndex(addedAttendee => {
          return addedAttendee.id === attendee.id
        })

        if (addedIndex < 0) {
          event.attendees.push(attendee)
        }
      })

      event.id = id

      await this.collection.doc(id).update(event)

      // TODO: Create a constants object and replace this message
      const successMessage = 'Attendees added succesfully'
      response = this.getSuccessResponse(event, successMessage)
    } catch (err) {
      const errorMessage = 'Error while adding attendees to event'
      /* eslint-disable no-console */
      // console.error(errorMessage, err)
      /* eslint-enable */
      response = this.getErrorResponse(errorMessage)
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
}

module.exports = EventsService
