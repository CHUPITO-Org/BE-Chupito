'use strict'

const setupFirebaseAdminSDKApp = require('./firebase-admin.application')
const setupFirebaseAuthSDKApp = require('./firebase-auth.application')
const setupMongoDB = require('./mongo-client')

module.exports = async () => {
  const adminSDK = setupFirebaseAdminSDKApp()
  const authSDK = setupFirebaseAuthSDKApp()

  const adminAuth = adminSDK.auth()
  const newAdminAuth = authSDK.auth()
  const dbInstance = adminSDK.firestore()
  const bucket = adminSDK.storage().bucket()

  const clientMongo = await setupMongoDB()

  return {
    adminAuth,
    newAdminAuth,
    dbInstance,
    bucket,
    clientMongo,
  }
}
