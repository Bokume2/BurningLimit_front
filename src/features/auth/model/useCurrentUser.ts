import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { observeAuthState } from './auth'

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => observeAuthState(setUser), [])

  return user
}
