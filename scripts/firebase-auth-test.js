const environment = require('../environment')
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth')
const { initializeApp } = require('firebase/app')

const firebaseSetup = environment.getFirebaseConfig()

const firebaseConfig = {
  apiKey: firebaseSetup.API_KEY,
  authDomain: firebaseSetup.AUTH_DOMAIN,
  projectId: firebaseSetup.PROJECT_ID,
  storageBucket: firebaseSetup.STORAGE_BUCKET,
  messagingSenderId: firebaseSetup.MESSAGING_SENDER_ID,
  appId: firebaseSetup.APP_ID,
  measurementId: firebaseSetup.MEASUREMENT_ID,
}

let app = null

const getFirebaseApp = () => {
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

const runAuthentication = async () => {
  const auth = getAuth(getFirebaseApp())

  const email = firebaseSetup.TEST_EMAIL
  const password = firebaseSetup.TEST_PASSWORD
  signInWithEmailAndPassword(auth, email, password).then(userCredential => {
    userCredential.user.getIdToken().then(token => console.log('token: ', token))
  })
}

runAuthentication()
