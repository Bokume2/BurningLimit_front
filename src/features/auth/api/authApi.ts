import type { User } from 'firebase/auth'

export type AuthIdentity = {
  uid: string
}

export class BackendAuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BackendAuthenticationError'
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export async function verifyBackendAuthentication(
  user: User,
): Promise<AuthIdentity> {
  const idToken = await user.getIdToken()

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${idToken}` },
    })
  } catch {
    throw new BackendAuthenticationError(
      'バックエンドに接続できません。起動状態を確認してください。',
    )
  }

  if (!response.ok) {
    throw new BackendAuthenticationError(
      response.status === 401
        ? '認証情報を確認できませんでした。もう一度お試しください。'
        : 'バックエンドで認証を確認できませんでした。',
    )
  }

  return (await response.json()) as AuthIdentity
}
