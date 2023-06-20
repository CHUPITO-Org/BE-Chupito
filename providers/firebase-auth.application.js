'use strict'

const admin = require('firebase-admin')
const dotenv = require('dotenv')

const serviceAccount = require('./../services-config/app.json')
const environment = require('../environment')

const firebaseConfig = environment.getFirebaseConfig()
const account = { ...serviceAccount }

dotenv.config()

account.type = 'service_account'
account.project_id =  'chupito-c5p5t'
account.private_key_id = firebaseConfig.AUTH_PRIVATE_KEY_ID
account.private_key = firebaseConfig.AUTH_PRIVATE_KEY
account.client_email = firebaseConfig.AUTH_CLIENT_EMAIL
account.client_id = firebaseConfig.AUTH_CLIENT_ID
account.auth_uri = 'https://accounts.google.com/o/oauth2/auth'
account.token_uri = 'https://oauth2.googleapis.com/token'
account.auth_provider_x509_cert_url= 'https://www.googleapis.com/oauth2/v1/certs'
account.client_x509_cert_url = firebaseConfig.AUTH_CLIENT_X509_CERT_URL

let app = null

module.exports = () => { 
  if (!app) {
    app = admin.initializeApp({
      credential: admin.credential.cert(account),
    })
  }

  return app
}
