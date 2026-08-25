import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export class FirebaseConfigurationError extends Error {
  constructor() {
    super('Firebaseの設定が不足しています。.env.localを確認してください。')
    this.name = 'FirebaseConfigurationError'
  }
}

let auth: Auth | undefined

export function getFirebaseAuth() {
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId
  ) {
    throw new FirebaseConfigurationError()
  }

  if (!auth) {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
  }

  return auth
}
