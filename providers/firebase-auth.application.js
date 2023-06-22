'use strict'

const admin = require('firebase-admin')
const dotenv = require('dotenv')

const serviceAccount = require('./../services-config/app.json')

const account = { ...serviceAccount }

dotenv.config()


account.project_id = process.env.AUTH_PROJECT_ID
account.private_key_id = process.env.AUTH_PRIVATE_KEY_ID
account.private_key = JSON.parse(`"${process.env.AUTH_PRIVATE_KEY}"`)
account.client_email = process.env.AUTH_CLIENT_EMAIL
account.client_id = process.env.AUTH_CLIENT_ID
account.client_x509_cert_url = process.env.AUTH_CLIENT_CERT_URL

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
