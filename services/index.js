'use strict'

const setupServiceProviders = require('./../providers')

const UserService = require('./user.service')
const setupAttendeesService = require('./attendees.service')
const EventsService = require('./events.service')
const AuthenticationService = require('./authentication.service')
const setupRolesService = require('./roles.service')
const HeadquartersService = require('./headquarters.service')
const setupStorageService = require('./storage.service')
const setupAccountsService = require('./accounts.service')
const setupSessionService = require('./session.service')
const setupAuthCodeService = require('./auth.codes.service')

module.exports = async () => {
  let db = null
  const serviceProviders = await setupServiceProviders()

  const authenticationService = new AuthenticationService(serviceProviders.adminAuth)
  const userService = new UserService(serviceProviders.dbInstance)
  const attendeesService = setupAttendeesService(serviceProviders.dbInstance)
  process.env.DB === 'mongodb'
    ? (db = serviceProviders.clientMongo)
    : (db = serviceProviders.dbInstance)
  const eventsService = new EventsService(db)
  const rolesService = setupRolesService(serviceProviders.dbInstance)
  const headquartersService = new HeadquartersService(serviceProviders.dbInstance)
  const storageService = setupStorageService(serviceProviders.bucket)
  const accountsService = setupAccountsService(serviceProviders.dbInstance)
  const sessionService = setupSessionService(serviceProviders.adminAuth)
  const authCodesService = setupAuthCodeService(
    serviceProviders.adminAuth,
    serviceProviders.dbInstance
  )

  return {
    authCodesService,
    authenticationService,
    accountsService,
    attendeesService,
    eventsService,
    headquartersService,
    rolesService,
    storageService,
    userService,
    sessionService,
  }
}
