const admin = require('firebase-admin')
const environment = require('../environment')
const serviceAccount = require('./../services-config/app.json')

const firebaseConfig = environment.getFirebaseConfig()
const account = { ...serviceAccount }


account.project_id =  firebaseConfig.AUTH_PROJECT_ID
account.private_key_id = firebaseConfig.AUTH_PRIVATE_KEY_ID
account.private_key = firebaseConfig.AUTH_PRIVATE_KEY
account.client_email = firebaseConfig.AUTH_CLIENT_EMAIL
account.client_id = firebaseConfig.AUTH_CLIENT_ID
account.client_x509_cert_url = firebaseConfig.AUTH_CLIENT_X509_CERT_URL

admin.initializeApp({
  credential: admin.credential.cert(account),
})

admin
  .auth()
  .createCustomToken(firebaseConfig.TEST_USER)
  .then(customToken => {
    console.log('Custom token:', customToken)
  })
  .catch(error => {
    console.error('Error creating custom token:', error)
  })
