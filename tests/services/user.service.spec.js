'use strict'

const test = require('ava')
const sinon = require('sinon')

const UserService = require('../../services/user.service')

let sandbox = null
let userService
let dbInstanceStub = null
let collectionKey = 'users'

const eventsService = {
  findById: sinon.stub().resolves({
    data: {
      id: 'event-id',
      attendees: ['user-id'],
    },
  }),
  doList: sinon.stub().resolves({
    data: [
      {
        _id: 'event-1',
        name: 'Test Event',
        status: 'created',
        eventDate: '2023-08-16T18:30:00.000',
        attendees: ['user-id', 'user2-id'],
      },
      {
        _id: 'event-2',
        name: 'Test Event 2',
        status: 'created',
        eventDate: '2024-02-15T06:30:00.000',
        description: 'Opps! No description',
        attendees: [],
      },
    ],
  }),
}

test.beforeEach(() => {
  sandbox = sinon.createSandbox()

  dbInstanceStub = {}
  dbInstanceStub.collection = sandbox.stub()
  dbInstanceStub.collection.withArgs(collectionKey).returns({
    get: () => {
      return Promise.resolve([
        {
          id: 'aaaaaaaaaaaaaaaa',
          data: () => {
            return {
              userId: '1',
              email: 'test01@email.com',
              name: '',
              lastName: '',
              isAdmin: true,
              isEnabled: true,
              avatarUrl: '',
              role: {
                id: '1',
                name: 'Marketing',
              },
            }
          },
        },
        {
          id: 'bbbbbbbbbbbbbbb',
          data: () => {
            return {
              userId: '2',
              email: 'test02@email.com',
              name: '',
              lastName: '',
              isAdmin: false,
              isEnabled: true,
              avatarUrl: '',
              role: {
                id: '2',
                name: 'Human Resources',
              },
            }
          },
        },
      ])
    },
    doc: path => {
      return {
        get: () => {
          return Promise.resolve({
            exists: true,
            data: () => {
              return {
                userId: '2',
                email: 'test@email.com',
                name: '',
                lastName: '',
                isAdmin: false,
                isEnabled: true,
                avatarUrl: '',
                role: {
                  id: '1',
                  name: 'Marketing',
                },
              }
            },
          })
        },
        delete: () => {
          return {}
        },
        set: data => {
          return {}
        },
        update: data => {
          return Promise.resolve({ data })
        },
      }
    },
    add: data => {
      return Promise.resolve({ id: 10000 })
    },
  })

  userService = new UserService(dbInstanceStub)

  userService.addRegisteredField = sinon.stub().callsFake(async userId => {
    const eventsResponse = await eventsService.doList()
    const addRegisteredFieldResponse = eventsResponse.data.map(event => ({
      id: event._id,
      name: event.name,
      status: event.status,
      eventDate: event.eventDate,
      description: event.description || 'Exciting event details coming soon!',
      subscribed: event.attendees.includes(userId),
    }))
    return addRegisteredFieldResponse
  })
})

test.afterEach(() => {
  // Restore sandbox
  sandbox && sandbox.restore()
  userService = null
})

test.serial('Create user: success response', async t => {
  const userData = {
    name: 'Juan',
    lastName: 'Perez',
    email: 'test@email.com',
    isAdmin: true,
    isEnabled: true,
    uid: 'ThisIsAUserUID',
  }

  let newUser = await userService.create(userData)

  t.is(Object.prototype.hasOwnProperty.call(newUser, 'message'), true, 'Expected message key')
  t.is(Object.prototype.hasOwnProperty.call(newUser, 'data'), true, 'Expected data key')

  t.is(newUser['data'].hasOwnProperty('uid'), true, 'Expected userId key')
  t.is(newUser['data'].hasOwnProperty('id'), true, 'Expected id key')
  t.is(newUser['data'].hasOwnProperty('email'), true, 'Expected email key')
  t.is(newUser['data'].hasOwnProperty('name'), true, 'Expected name key')
  t.is(newUser['data'].hasOwnProperty('lastName'), true, 'Expected lastName key')
  t.is(newUser['data'].hasOwnProperty('isAdmin'), true, 'Expected isAdmin key')
  t.is(newUser['data'].hasOwnProperty('isEnabled'), true, 'Expected isEnabled key')
})

test.serial('Do list all users', async t => {
  let allUsers = await userService.doList()

  t.is(allUsers.hasOwnProperty('message'), true, 'Expected message key')
  t.is(allUsers.hasOwnProperty('data'), true, 'Expected data key')

  t.is(allUsers['data'].length, 2, 'Expected 2 elements')

  allUsers['data'].forEach(userData => {
    t.is(userData.hasOwnProperty('id'), true, 'Expected id key')
    t.is(userData.hasOwnProperty('userId'), true, 'Expected userId key')
    t.is(userData.hasOwnProperty('name'), true, 'Expected name key')
    t.is(userData.hasOwnProperty('lastName'), true, 'Expected lastName key')
    t.is(userData.hasOwnProperty('isAdmin'), true, 'Expected isAdmin key')
    t.is(userData.hasOwnProperty('role'), true, 'Expected role key')
  })
})

test.serial('Get user', async t => {
  const docUserId = 'abcdefghi'

  let userInfo = await userService.findById(docUserId)

  t.is(userInfo.hasOwnProperty('message'), true, 'Expected message key')
  t.is(userInfo.hasOwnProperty('data'), true, 'Expected data key')

  t.is(userInfo['data'].hasOwnProperty('userId'), true, 'Expected uid key')
  t.is(userInfo['data'].hasOwnProperty('id'), true, 'Expected id key')
  t.is(userInfo['data'].hasOwnProperty('name'), true, 'Expected name key')
  t.is(userInfo['data'].hasOwnProperty('lastName'), true, 'Expected lastname key')
  t.is(userInfo['data'].hasOwnProperty('avatarUrl'), true, 'Expected avatarUrl key')
  t.is(userInfo['data'].hasOwnProperty('isAdmin'), true, 'Expected isAdmin key')
  t.is(userInfo['data'].hasOwnProperty('isEnabled'), true, 'Expected isEnabled key')
  t.is(userInfo['data'].hasOwnProperty('role'), true, 'Expected role key')
})

test.serial('Update user', async t => {
  const userId = 1,
    data = {
      name: 'Juan',
      lastname: 'Perez',
      isAdmin: true,
      avatarUrl: '',
    }

  let updatedUser = await userService.update(userId, data)

  t.is(updatedUser.hasOwnProperty('message'), true, 'Expected message key')
  t.is(updatedUser.hasOwnProperty('data'), true, 'Expected data key')
})

test.serial('Delete user', async t => {
  const userId = 1

  let data = await userService.toggleEnable(userId)

  t.is(data.hasOwnProperty('message'), true, 'Expected message attribute')
})

test.serial('Get user attendance: user is an attendee', async t => {
  const eventId = 'event-id'
  const userId = 'user-id'

  const userService = new UserService(dbInstanceStub)

  let attendanceResponse = await userService.checkUserAttendeeStatus(eventId, userId, eventsService)

  t.is(attendanceResponse.hasOwnProperty('status'), true, 'Expected status key')
  t.is(attendanceResponse.hasOwnProperty('message'), true, 'Expected message key')
  t.is(attendanceResponse.hasOwnProperty('data'), true, 'Expected data key')
  t.is(attendanceResponse['data']['attendanceConfirmed'], true, 'Expected attendance status')
})

test.serial('Get user attendance: user is not an attendee', async t => {
  const eventId = 'event-id'
  const userId = 'user'

  const userService = new UserService(dbInstanceStub)

  let attendanceResponse = await userService.checkUserAttendeeStatus(eventId, userId, eventsService)

  t.is(attendanceResponse.hasOwnProperty('status'), true, 'Expected status key')
  t.is(attendanceResponse.hasOwnProperty('message'), true, 'Expected message key')
  t.is(attendanceResponse.hasOwnProperty('data'), true, 'Expected data key')
  t.is(attendanceResponse['data']['attendanceConfirmed'], false, 'Expected attendance status')
})

test.serial('Get user attendance: no event data', async t => {
  const eventId = 'event'
  const userId = 'user-id'
  const eventsService = {
    findById: sinon.stub().resolves(null),
  }
  const userService = new UserService(dbInstanceStub)

  let attendanceResponse = await userService.checkUserAttendeeStatus(eventId, userId, eventsService)

  t.is(attendanceResponse.hasOwnProperty('status'), true, 'Expected status key')
  t.is(attendanceResponse.hasOwnProperty('message'), true, 'Expected message key')
  t.is(attendanceResponse.hasOwnProperty('data'), true, 'Expected data key')
  t.is(
    attendanceResponse['message'],
    'No existing data for this event',
    'Expected attendance message'
  )
})

test.serial('Get user attendance: error getting user information', async t => {
  const eventId = 'event-id'
  const userId = 'user-id'

  const error = new Error('Error getting user information')
  const eventsService = {
    findById: sinon.stub().throws(error),
  }

  const userService = new UserService(dbInstanceStub)

  let attendanceResponse = await userService.checkUserAttendeeStatus(eventId, userId, eventsService)

  t.is(attendanceResponse.hasOwnProperty('status'), true, 'Expected status key')
  t.is(attendanceResponse.hasOwnProperty('message'), true, 'Expected message key')
  t.is(attendanceResponse.hasOwnProperty('data'), true, 'Expected no data key')
  t.is(attendanceResponse['status'], false, 'Expected error status')
  t.is(attendanceResponse['message'], 'Error getting user information', 'Expected error message')
})

test.serial('Fetch user event attendance: success', async t => {
  const userId = 'user-id'
  const expectedResponse = {
    id: 'event-1',
    name: 'Test Event',
    status: 'created',
    eventDate: '2023-08-16T18:30:00.000',
    description: 'Exciting event details coming soon!',
    subscribed: true,
  }

  const fetchedData = await userService.fetchUserEventAttendance(userId, eventsService)

  t.is(fetchedData.responseCode, 200, 'Expected response code to be 200')
  t.is(fetchedData.hasOwnProperty('status'), true, 'Expected status key')
  t.is(fetchedData.hasOwnProperty('message'), true, 'Expected message key')
  t.is(fetchedData.hasOwnProperty('data'), true, 'Expected data key')
  t.is(fetchedData.status, true, 'Expected status')
  t.is(fetchedData.message, 'Events retrieved successfully.', 'Expected successful message')
  t.is(fetchedData.data.length, 2, 'Expected two elements')
  t.deepEqual(fetchedData.data[0], expectedResponse, 'Expected same object ')
  t.deepEqual(fetchedData.data[1].subscribed, false, 'Expected subscribed status')
})

test.serial('Fetch user event attendance: no events', async t => {
  const userId = 'user-id'
  const eventsService = {
    doList: sinon.stub().resolves(null),
  }

  const fetchedData = await userService.fetchUserEventAttendance(userId, eventsService)

  t.is(fetchedData.responseCode, 200, 'Expected response code to be 200')
  t.is(fetchedData.message, 'No existing events to check', 'Expected response message')
  t.deepEqual(fetchedData.status, true, 'Expected status')
  t.deepEqual(fetchedData.data, {}, 'Expected data to be an empty object')
})

test.serial('Fetch user event attendance: error', async t => {
  const userId = 'user-id'
  const eventsService = {
    doList: sinon.stub().rejects(new Error('Error getting user information')),
  }

  const fetchedData = await userService.fetchUserEventAttendance(userId, eventsService)

  t.is(fetchedData.responseCode, 500, 'Expected response code to be 500')
  t.is(fetchedData.message, 'Error getting user information', 'Expected error response message')
  t.deepEqual(fetchedData.status, false, 'Expected status')
  t.deepEqual(fetchedData.data, {}, 'Expected data to be an empty object')
})
