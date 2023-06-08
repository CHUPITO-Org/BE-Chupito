'use strict'

const BaseController = require('../base.controller')
const serviceContainer = require('../../../services/service.container')

let baseController = new BaseController()

const get = async (request, response) => {
  const eventsService = await serviceContainer('events')

  const eventParameters = {}
  let responseCode = 500
  let responseData

  // TODO: Move all validations for a specific function
  eventParameters.year = !request.query.year ? new Date().getFullYear() : request.query.year

  eventParameters.headquarterId = !request.query.headquarterId ? null : request.query.headquarterId

  eventParameters.showAll = !request.query.showAll ? false : request.query.showAll === 'true'

  eventParameters.withAttendees = !request.query.withAttendees
    ? false
    : request.query.withAttendees === 'true'

  try {
    console.log('ENTRA AL CONTROLLER')
    const events = await eventsService.doList(eventParameters)
    //const events = await eventsService.doList()
    console.log(events)
    responseCode = events.responseCode
    responseData = baseController.getSuccessResponse(events.data, events.message)
  } catch (error) {
    const errorMessage = 'Error while listing events'
    /* eslint-disable no-console */
    // console.error(errorMessage, error)
    /* eslint-enable */
    responseData = baseController.getErrorResponse(errorMessage)
  }

  return response.status(responseCode).json(responseData)
}

module.exports = { get }
