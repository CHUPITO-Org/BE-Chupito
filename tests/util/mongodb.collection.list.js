'use strict'

const { v4: uuidGenerator } = require('uuid')

const MockMongoCollectionListElement = require('./mongodb.collection.list.element')
const FixtureService = require('../fixtures/fixtures.service')

class MockMongoCollectionList {
  constructor() {}

  static get(mockFixtureData, numberOfElements) {
    const fixtureData = FixtureService.getFixture(mockFixtureData)
    console.log('FIXTUREDATA', fixtureData.generate)
    const allData = []

    for (let i = 0; i < numberOfElements; i++) {
      const uid = uuidGenerator()
      allData.push(MockMongoCollectionListElement.getElement(uid, fixtureData.generate))
    }

    return Promise.resolve(allData)
  }
}

module.exports = MockMongoCollectionList
