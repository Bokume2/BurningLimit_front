import { FirebaseError } from 'firebase/app'
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Unsubscribe,
  type User,
} from 'firebase/auth'
import {
  BackendAuthenticationError,
  verifyBackendAuthentication,
} from '../api/authApi'
import {
  FirebaseConfigurationError,
  getFirebaseAuth,
} from '../lib/firebase'

async function finishAuthentication(user: User) {
  try {
    await verifyBackendAuthentication(user)
    return user
  } catch (error) {
    await signOut(getFirebaseAuth())
    throw error
  }
}

export async function createAccount(email: string, password: string) {
  const auth = getFirebaseAuth()
  await setPersistence(auth, browserLocalPersistence)
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  return finishAuthentication(credential.user)
}

export async function loginWithEmail(
  email: string,
  password: string,
  rememberMe: boolean,
) {
  const auth = getFirebaseAuth()
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence,
  )
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return finishAuthentication(credential.user)
}

export async function loginWithGoogle() {
  const auth = getFirebaseAuth()
  await setPersistence(auth, browserLocalPersistence)
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  const credential = await signInWithPopup(auth, provider)
  return finishAuthentication(credential.user)
}

export async function logout() {
  await signOut(getFirebaseAuth())
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), email)
}

export function observeAuthState(
  callback: (user: User | null) => void,
): Unsubscribe {
  try {
    return onAuthStateChanged(getFirebaseAuth(), callback, () => callback(null))
  } catch {
    callback(null)
    return () => undefined
  }
}

export function getAuthenticationErrorMessage(error: unknown) {
  if (
    error instanceof FirebaseConfigurationError ||
    error instanceof BackendAuthenticationError
  ) {
    return error.message
  }

  if (error instanceof FirebaseError) {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'このメールアドレスは既に登録されています。',
      'auth/invalid-credential': 'メールアドレスまたはパスワードが正しくありません。',
      'auth/invalid-email': 'メールアドレスの形式が正しくありません。',
      'auth/network-request-failed': '通信に失敗しました。接続状態を確認してください。',
      'auth/popup-closed-by-user': 'Googleログインがキャンセルされました。',
      'auth/popup-blocked': 'ポップアップがブロックされました。',
      'auth/too-many-requests': '試行回数が多すぎます。時間をおいてお試しください。',
      'auth/weak-password': 'より強いパスワードを設定してください。',
    }
    return messages[error.code] || '認証処理に失敗しました。'
  }

  return '認証処理に失敗しました。'
}
