'use strict'

const setupFirebaseAdminSDKApp = require('./firebase-admin.application')
const setupMongoDB = require('./mongo-client')

module.exports = async () => {
  const adminSDK = setupFirebaseAdminSDKApp()
  const dbInstance = adminSDK.firestore()
  const bucket = adminSDK.storage().bucket()

  const clientMongo = await setupMongoDB()

  return {
    dbInstance,
    bucket,
    clientMongo,
  }
}
