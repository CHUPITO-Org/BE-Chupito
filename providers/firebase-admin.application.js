'use strict'

const admin = require('firebase-admin')
const dotenv = require('dotenv')

const serviceAccount = require('./../services-config/app.json')

dotenv.config()

const account = {
  ...serviceAccount,
  project_id: process.env.AUTH_PROJECT_ID,
  private_key_id: process.env.AUTH_PRIVATE_KEY_ID,
  private_key: JSON.parse(`"${process.env.AUTH_PRIVATE_KEY}"`),
  client_email: process.env.AUTH_CLIENT_EMAIL,
  client_id: process.env.AUTH_CLIENT_ID,
  client_x509_cert_url: process.env.AUTH_CLIENT_CERT_URL,
}

let app = null

module.exports = () => {
  if (!app) {
    app = admin.initializeApp({
      credential: admin.credential.cert(account),
      storageBucket: process.env.AUTH_STORAGE_BUCKET,
    })
  }

  return app
}
