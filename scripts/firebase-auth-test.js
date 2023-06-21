const dotenv = require('dotenv')
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth')
const { initializeApp } = require('firebase/app')

dotenv.config()

const firebaseConfig = {
  apiKey: process.env.AUTH_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.AUTH_PROJECT_ID,
  storageBucket: process.env.AUTH_STORAGE_BUCKET,
  messagingSenderId: process.env.AUTH_MESSAGING_SENDER_ID,
  appId: process.env.AUTH_APP_ID,
  measurementId: process.env.AUTH_MEASUREMENT_ID,
}

let app = null

// 

const getFirebaseApp = () => {
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

const runAuthentication = async () => {
  const auth = getAuth(getFirebaseApp())

  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PWD
  signInWithEmailAndPassword(auth, email, password).then(userCredential => {
    userCredential.user.getIdToken().then(token => console.log('token: ', token))
  })
}

runAuthentication()
