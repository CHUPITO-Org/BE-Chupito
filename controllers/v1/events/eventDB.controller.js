const BaseController = require('../base.controller')

const EventServiceDB = require('../../../services/eventDB.service')
const { response, request } = require('express')
const serviceContainer = require('../../../services/service.container')

let baseController = new BaseController()

// const post = async (request, response) => {
//   try {
//     console.log('entra al controller de post')
//     const eventToSave = {
//       id: request.body.id,
//       name: request.body.name,
//       status: request.body.status,
//       address: request.body.address,
//       eventDate: request.body.eventDate,
//       headquarter: request.body.headquarter,
//     }
//     const event = await EventServiceDB.creatEvent(eventToSave)
//     console.log('LLEGA DESPUES DEL EVENTO')
//     console.log(event)
//     return response
//       .status(event.responseCode)
//       .json(baseController.getSuccessResponse(event.data, event.message))
//   } catch (error) {
//     return response.status(500).json(baseController.getErrorResponse('Error adding an event.'))
//   }
// }

const get = async (request, response) => {
  const eventsService = await serviceContainer('events')
  try {
    console.log('Controller')
    const events = await eventsService.findAll()

    console.log(events)
    return response
      .status(events.responseCode)
      .json(baseController.getSuccessResponse(events.data, events.message))
  } catch (error) {
    return response.status(500).json(baseController.getErrorResponse(errorMessage))
  }
}

module.exports = {
  // post,
  get,
}
