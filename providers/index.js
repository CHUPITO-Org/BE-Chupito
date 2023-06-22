'use strict'
// TODO: Delete legacy connection setup after full refactor of usage.
// const setupFirebaseAdminSDKApp = require('./firebase-admin.application')
const setupFirebaseAuthSDKApp = require('./firebase-auth.application')
const setupMongoDB = require('./mongo-client')

module.exports = async () => {
  // TODO: Delete legacy connection setup after full refactor of usage.
  // const adminSDK = setupFirebaseAdminSDKApp()
  const adminSDK = setupFirebaseAuthSDKApp()
  const adminAuth = adminSDK.auth()
  const dbInstance = adminSDK.firestore()
  const bucket = adminSDK.storage().bucket()

  const clientMongo = await setupMongoDB()

  return {
    adminAuth,
    dbInstance,
    bucket,
    clientMongo,
  }
}
