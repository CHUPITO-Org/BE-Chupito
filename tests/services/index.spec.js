'use strict';

const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

let sandbox = null;
let database = null;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();

  const getMockProviders = () => {
    return {
      clientAuth: sinon.stub(),
      adminAuth: sinon.stub(),
      dbInstance: sinon.stub(),
      storage: () => {
        return {
          bucket: sinon.stub()
        };
      }
    };
  };

  const setupDatabase = proxyquire('./../../services', {
    './../providers': getMockProviders,
    './auth.codes.service': () => {},
    './user.service': () => {},
    './attendees.service': () => {},
    './events.service': () => {},
    './authentication.service': () => {},
    './roles.service': () => {},
    './headquarters.service': () => {},
    './storage.service': () => {},
    './accounts.service': () => {},
    './transactions.service': () => {}
  });
  database = setupDatabase();
});

test.afterEach(() => {
  sandbox && sandbox.restore();
  database = null;
});

test('Check database services', t => {
  t.is(database.hasOwnProperty('authenticationService'), true, 'Expected authentication service');
  t.is(database.hasOwnProperty('userService'), true, 'Expected user service');
  t.is(database.hasOwnProperty('attendeesService'), true, 'Expected attendee service');
  t.is(database.hasOwnProperty('eventsService'), true, 'Expected events service');
  t.is(database.hasOwnProperty('rolesService'), true, 'Expected roles service');
  t.is(database.hasOwnProperty('headquartersService'), true, 'Expected headquarters service');
});