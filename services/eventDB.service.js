'use strict'

const mongoose = require('mongoose')
const Event = require('../models/eventSchema')
const BaseService = require('./base.service')

class EventServiceDB extends BaseService {
  constructor(dbInstance) {
    super()
    //this.db = dbInstance.db('mongodb')
    this.collection = dbInstance.collection('events')
    //this.model = Event
    this.eventCreatedStatus = 'created'
  }

  async creatEvent(data) {
    try {
      data.status = this.eventCreatedStatus

      const eventToSave = data

      eventToSave.year = new Date(data.date).getFullYear()

      console.log(eventToSave)
      return this.getSuccessResponse(
        await this.collection.save(eventToSave),
        'Event was successfully created'
      )
    } catch (error) {
      return this.getErrorResponse('Error adding a event')
    }
  }

  async findAll() {
    try {
      const data = await this.collection.find({}).toArray()
      console.log('data: ', data)
      return this.getSuccessResponse(data, '')
    } catch (error) {
      return error
    }
  }
}

module.exports = EventServiceDB
