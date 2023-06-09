'use strict'

const BaseController = require('../base.controller')
const serviceContainer = require('../../../services/service.container')

const isObjectEmpty = require('../../../helpers/utils')

let baseController = new BaseController()

const get = async (request, response) => {
  const eventsService = await serviceContainer('events')

  if (!request.params.id) {
    return response.status(400).json(baseController.getErrorResponse('Missing eventId parameter'))
  }

  const id = request.params.id
  let responseCode = 500
  let responseData

  try {
    let eventResponse = await eventsService.findById(id)
    responseCode = eventResponse.responseCode
    responseData = baseController.getSuccessResponse(eventResponse.data, eventResponse.message)
  } catch (err) {
    const errorMessage = `Error while getting event with id: ${id}`
    /* eslint-disable no-console */
    // console.error(errorMessage, err)
    /* eslint-enable */
    responseData = baseController.getErrorResponse(errorMessage)
  }
  return response.status(responseCode).json(responseData)
}

const post = async (request, response) => {
  const eventsService = await serviceContainer('events')

  let eventData = {}
  let responseData
  let responseCode

  if (
    !request.body.name ||
    !request.body.headquarter ||
    !request.body.date ||
    !request.body.responsable
  ) {
    return response.status(400).json(baseController.getErrorResponse('Parameters are missing'))
  }

  eventData = {
    name: request.body.name,
    date: request.body.date,
    headquarter: request.body.headquarter,
    responsable: request.body.responsable,
    images: [],
  }

  eventData['address'] = request.body.address ? request.body.address : ''
  eventData['placeName'] = request.body.placeName ? request.body.placeName : ''

  eventData['phoneNumber'] = request.body.phoneNumber ? request.body.phoneNumber : ''

  try {
    const eventResponse = await eventsService.create(eventData)

    responseData = baseController.getSuccessResponse(eventResponse.data, eventResponse.message)
    responseCode = eventResponse.responseCode
  } catch (err) {
    console.error('Error adding an event: ', err)
    responseData = baseController.getErrorResponse('Error adding an event.')
    responseCode = 500
  }

  return response.status(responseCode).json(responseData)
}

const update = async (request, response) => {
  const eventsService = await serviceContainer('events')

  let eventData = {}
  let responseData
  let responseCode

  if (!request.params.id) {
    return response.status(400).json(baseController.getErrorResponse('Missing eventId parameter'))
  }
  // TODO: All these validations should be move into a service
  if (request.body.name) {
    eventData.name = request.body.name
  }

  if (request.body.headquarter) {
    eventData.headquarter = request.body.headquarter
  }

  if (request.body.date) {
    eventData.date = request.body.date
  }

  if (request.body.responsable) {
    eventData.responsable = request.body.responsable
  }

  if (request.body.address) {
    eventData.address = request.body.address
  }

  if (request.body.placeName) {
    eventData.placeName = request.body.placeName
  }

  if (request.body.eventType) {
    eventData.eventType = request.body.eventType
  }

  if (request.body.deletedImages) {
    eventData.deletedImages = request.body.deletedImages
  }

  try {
    const eventResponse = await eventsService.update(request.params.id, eventData)

    responseCode = eventResponse.responseCode
    responseData = baseController.getSuccessResponse(eventResponse.data, eventResponse.message)
  } catch (err) {
    responseCode = 500
    console.error('Error updating event: ', err)
    responseData = baseController.getErrorResponse('Error updating event')
  }

  return response.status(responseCode).json(responseData)
}

const updateImages = async (request, response) => {
  const eventsService = await serviceContainer('events')

  if (!request.body.images) {
    return response.status(400).json(baseController.getErrorResponse('No images sent'))
  }

  let responseCode
  let responseData

  const id = request.params.id

  try {
    const eventResponse = await eventsService.updateImages(id, request.body.images)

    responseCode = eventResponse.responseCode
    responseData = baseController.getSuccessResponse(eventResponse.data, eventResponse.message)
  } catch (err) {
    responseCode = 500
    console.error('Error updating images: ', err)
    responseData = baseController.getErrorResponse('Error updating images')
  }

  return response.status(responseCode).json(responseData)
}

const deleteImage = async (request, response) => {
  const eventsService = await serviceContainer('events')

  if (!request.params.id || !request.params.idImage) {
    return response.status(400).json(baseController.getErrorResponse('Wrong parameters'))
  }

  const id = request.params.id
  const idImage = request.params.idImage
  let responseData
  let responseCode = 500

  try {
    const deleteResponse = await eventsService.deleteImage(id, idImage)

    responseCode = deleteResponse.responseCode
    responseData = baseController.getSuccessResponse(deleteResponse.data, deleteResponse.message)
  } catch (err) {
    const errorMessage = 'Error while deleting image'
    /* eslint-disable no-console */
    // console.error(errorMessage, err);
    /* eslint-enable */
    responseData = baseController.getErrorResponse(errorMessage)
  }

  return response.status(responseCode).json(responseData)
}

const open = async (request, response) => {
  const eventsService = await serviceContainer('events')

  if (!request.params.id) {
    return response.status(400).json(baseController.getErrorResponse('Wrong parameters'))
  }

  let responseCode
  let responseData

  const id = request.params.id

  try {
    const openResponse = await eventsService.open(id)

    responseCode = openResponse.responseCode
    responseData = baseController.getSuccessResponse(openResponse.data, openResponse.message)
  } catch (error) {
    responseCode = 500
    console.error('Error while opening event: ', error)
    responseData = baseController.getErrorResponse('Error while opening event')
  }

  return response.status(responseCode).json(responseData)
}

const pause = async (request, response) => {
  const eventsService = await serviceContainer('events')

  if (!request.params.id) {
    return response.status(400).json(baseController.getErrorResponse('Wrong parameters'))
  }

  const id = request.params.id
  let responseCode
  let responseData

  try {
    const pauseResponse = await eventsService.pause(id)

    responseCode = pauseResponse.responseCode
    responseData = baseController.getSuccessResponse(pauseResponse.data, pauseResponse.message)
  } catch (error) {
    responseCode = 500
    console.error('Error while pausing event: ', error)
    responseData = baseController.getErrorResponse('Error while pausing event')
  }

  return response.status(responseCode).json(responseData)
}

const close = async (request, response) => {
  const eventsService = await serviceContainer('events')

  if (!request.params.id) {
    return response.status(400).json(baseController.getErrorResponse('Wrong parameters'))
  }

  const id = request.params.id

  let responseCode
  let responseData

  try {
    const closeResponse = await eventsService.close(id)

    responseCode = closeResponse.responseCode
    responseData = baseController.getSuccessResponse(closeResponse.data, closeResponse.message)
  } catch (error) {
    let errorMessage = `Error while closing event with id: ${id}`
    console.error(errorMessage, error)
    responseCode = 500
    responseData = baseController.getErrorResponse('Error while closing event')
  }

  return response.status(responseCode).json(responseData)
}

const addAttendees = async (request, response) => {
  const eventsService = await serviceContainer('events')
  const authService = await serviceContainer('authentication')
  if (!request.params.id || !request.body.attendees || isObjectEmpty(request.body.attendees)) {
    return response.status(400).json(baseController.getErrorResponse('Wrong parameters'))
  }

  const id = request.params.id

  const token = request.headers.authorization.replace('Bearer ', '')

  let responseCode
  let responseData

  try {
    const authVerifyResponse = await authService.verifyToken(token)

    if (!authVerifyResponse.status) {
      return response
        .status(400)
        .json(baseController.getErrorResponse('Error while verifying token id'))
    }
    const addAttendeesResponse = await eventsService.addAttendees(id, authVerifyResponse.data.id)

    responseCode = addAttendeesResponse.responseCode
    responseData = baseController.getSuccessResponse(
      addAttendeesResponse.data,
      addAttendeesResponse.message
    )
  } catch (error) {
    let errorMessage = `Error while adding attendees to event with id: ${id}`
    console.error(errorMessage, error)
    responseCode = 500
    responseData = baseController.getErrorResponse(errorMessage)
  }

  return response.status(responseCode).json(responseData)
}

const remove = async (request, response) => {
  const eventsService = await serviceContainer('events')
  const storageService = await serviceContainer('storage')

  if (!request.params.id) {
    return response.status(400).json(baseController.getErrorResponse('Wrong parameters'))
  }

  const id = request.params.id

  let responseCode = 500
  let responseData

  try {
    const eventInfo = await eventsService.findById(id)
    const eventResponse = await eventsService.remove(id)
    // Remove all images related to an event
    if (eventInfo.data.images && eventInfo.data.images.length > 0) {
      await storageService.eraseList(eventInfo.data.images)
    }

    responseCode = eventResponse.responseCode
    responseData = baseController.getSuccessResponse(eventResponse.data, eventResponse.message)
  } catch (err) {
    const errorMessage = `Error while removing event with id: ${id}`
    /* eslint-disable no-console */
    // console.error(errorMessage, err)
    /* eslint-enable */
    responseData = baseController.getErrorResponse(errorMessage)
  }

  return response.status(responseCode).json(responseData)
}

module.exports = {
  get,
  post,
  update,
  updateImages,
  deleteImage,
  open,
  pause,
  close,
  addAttendees,
  remove,
}
