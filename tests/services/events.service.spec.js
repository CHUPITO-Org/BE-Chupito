'use strict'

require('dotenv').config({ path: '.env.test' })

const test = require('ava')
const sinon = require('sinon')
const { ObjectId } = require('mongodb')

const mockMongoDBCollectionList = require('./../util/mongodb.collection.list')

const EventsService = require('../../services/events.service')

let collectionName = 'events'
let sandbox = null
let eventsService
let dbInstanceStub = null

test.beforeEach(() => {
  sandbox = sinon.createSandbox()

  dbInstanceStub = {
    collection: sandbox.stub().returns({
      find: sandbox.stub().resolves(mockMongoDBCollectionList.get(collectionName, 1)),
      findOne: sandbox.stub().resolves({
        id: new ObjectId(),
        name: 'Juan Perez',
        date: 'Perez',
        headquarter: {
          id: 'aaaaaaa',
          name: 'Buenos Aires',
        },
        status: 'created',
        address: '120 Main Street',
      }),
      deleteOne: sandbox.stub().resolves(),
      insertOne: sandbox.stub().resolves({ id: 10000 }),
      updateOne: sandbox.stub().resolves({}),
    }),
  }

  eventsService = new EventsService(dbInstanceStub)
})

test.afterEach(() => {
  // Restore sandbox
  sandbox && sandbox.restore()
})

test.skip('Create event', async t => {
  const data = {
    name: 'Juan Perez',
    date: 'Perez',
    headquarter: {
      id: 'aaaaaaa',
      name: 'Buenos Aires',
    },
    status: 'created',
    placeName: '',
    address: '120 Main Street',
    phoneNumber: '',
    responsable: {},
  }

  let newEvent = await eventsService.create(data)
  t.is(newEvent.hasOwnProperty('message'), true, 'Expected message key')
  t.is(newEvent.hasOwnProperty('data'), true, 'Expected data key')

  t.is(newEvent['data'].hasOwnProperty('id'), true, 'Expected id key')
  t.is(newEvent['data'].hasOwnProperty('name'), true, 'Expected name key')
  t.is(newEvent['data'].hasOwnProperty('date'), true, 'Expected date key')
  t.is(newEvent['data'].hasOwnProperty('headquarter'), true, 'Expected headquarter key')
  t.is(newEvent['data'].hasOwnProperty('status'), true, 'Expected status key')
  t.is(newEvent['data'].hasOwnProperty('placeName'), true, 'Expected placeName key')
  t.is(newEvent['data'].hasOwnProperty('address'), true, 'Expected address key')
  t.is(newEvent['data'].hasOwnProperty('responsable'), true, 'Expected responsable key')
})

// TODO: Review mock data to run this test
test.serial('Do list all events without params', async t => {
  let eventsData = await eventsService.doList({})

  console.log('DATA', eventsData)
  // for (const aux of eventsData) {
  //   console.log(aux)
  // }

  t.is(eventsData.hasOwnProperty('message'), true, 'Expected message key')
  t.is(eventsData.hasOwnProperty('data'), true, 'Expected data key')

  eventsData['data'].forEach(eventData => {
    t.is(eventData.hasOwnProperty('id'), true, 'Expected id key')
    t.is(eventData.hasOwnProperty('name'), true, 'Expected name key')
    t.is(eventData.hasOwnProperty('date'), true, 'Expected date key')
    t.is(eventData.hasOwnProperty('headquarter'), true, 'Expected headquarter key')
    t.is(eventData.hasOwnProperty('placeName'), true, 'Expected placeName key')
    t.is(eventData.hasOwnProperty('address'), true, 'Expected address key')
    t.is(eventData.hasOwnProperty('responsable'), true, 'Expected responsable key')
    t.is(eventData.hasOwnProperty('status'), true, 'Expected status key')
  })
})

test.skip('Do list all events with year and headquarter', async t => {
  const eventsParams = {
    year: '2019',
    headquarterId: 'aaaaaaa',
  }

  let eventsData = await eventsService.doList(eventsParams)

  t.is(eventsData.hasOwnProperty('message'), true, 'Expected message key')
  t.is(eventsData.hasOwnProperty('data'), true, 'Expected data key')
  t.is(eventsData['data'].length, 2, 'Expected 2 elements')

  eventsData['data'].forEach(eventData => {
    t.is(eventData.hasOwnProperty('id'), true, 'Expected id key')
    t.is(eventData.hasOwnProperty('name'), true, 'Expected name key')
    t.is(eventData.hasOwnProperty('date'), true, 'Expected date key')
    t.is(eventData.hasOwnProperty('headquarter'), true, 'Expected headquarter key')
    t.is(eventData.hasOwnProperty('placeName'), true, 'Expected placeName key')
    t.is(eventData.hasOwnProperty('address'), true, 'Expected address key')
    t.is(eventData.hasOwnProperty('responsable'), true, 'Expected responsable key')
    t.is(eventData.hasOwnProperty('status'), true, 'Expected status key')
  })
})

test.skip('Get event', async t => {
  const eventId = 'abcdefghi'

  let eventData = await eventsService.findById(eventId)

  t.is(eventData.hasOwnProperty('message'), true, 'Expected message key')
  t.is(eventData.hasOwnProperty('data'), true, 'Expected data key')
  t.is(eventData['data'].hasOwnProperty('id'), true, 'Expected documentId key')
  t.is(eventData['data'].hasOwnProperty('name'), true, 'Expected name key')
  t.is(eventData['data'].hasOwnProperty('lastname'), true, 'Expected lastname key')
  t.is(eventData['data'].hasOwnProperty('avatarUrl'), true, 'Expected avatarUrl key')
  t.is(eventData['data'].hasOwnProperty('isAdmin'), true, 'Expected isAdmin key')
  t.is(eventData['data']['id'], eventId, 'Expected same document Id')
})

test.skip('Update event', async t => {
  const eventId = 1,
    data = {
      name: 'Hackatrix 2019',
      date: '2019-03-15T17:00:00.000',
      headquarter: {},
      placeName: '',
      status: 'created',
      responsable: {},
    }

  let updatedData = await eventsService.update(eventId, data)

  t.is(updatedData.hasOwnProperty('message'), true, 'Expected message key')
  t.is(updatedData.hasOwnProperty('data'), true, 'Expected data key')
})

test.skip('Update event deleting images', async t => {
  const eventId = 1,
    data = {
      name: 'Hackatrix 2019',
      date: '2019-03-15T17:00:00.000',
      headquarter: {},
      placeName: '',
      status: 'created',
      responsable: {},
      deletedImages: ['a5b3d252-79bf-4b88-8eb1-08e20f8a4ca3'],
    }

  let updatedData = await eventsService.update(eventId, data)

  t.is(updatedData.hasOwnProperty('message'), true, 'Expected message key')
  t.is(updatedData.hasOwnProperty('data'), true, 'Expected data key')
})

test.skip('Add attendees', async t => {
  const eventId = '1vZHkInPqe1bShakHXiN',
    attendees = [
      {
        name: 'Juan Perez',
      },
      {
        name: 'Andrew Garfield',
      },
    ]

  let addAttendeesResponse = await eventsService.addAttendees(eventId, attendees)

  t.is(addAttendeesResponse.hasOwnProperty('message'), true, 'Expected message key')
  t.is(addAttendeesResponse.hasOwnProperty('data'), true, 'Expected data key')
})

test.skip('Delete event', async t => {
  const eventId = '1vZHkInPqe1bShakHXiN'
  const deleteAttendeeResponse = await eventsService.remove(eventId)
  t.is(deleteAttendeeResponse.hasOwnProperty('message'), true, 'Expected message key')
  t.is(deleteAttendeeResponse.hasOwnProperty('data'), true, 'Expected data key')
})
