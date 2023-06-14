'use strict'

const { v4: uuidGenerator } = require('uuid')

const MockMongoCollectionListElement = require('./mongodb.collection.list.element')
const FixtureService = require('../fixtures/fixtures.service')

class MockMongoCollectionList {
  constructor() {}

  static get(mockFixtureData, numberOfElements) {
    const fixtureClass = FixtureService.getFixture(mockFixtureData)

    const allData = []

    for (let i = 0; i < numberOfElements; i++) {
      const uid = uuidGenerator()
      allData.push(MockMongoCollectionListElement.getElement(uid, fixtureClass.generate({})))
    }
    return Promise.resolve(allData)
  }
}

module.exports = MockMongoCollectionList
