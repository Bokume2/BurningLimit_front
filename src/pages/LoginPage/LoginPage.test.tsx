import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { paths } from '../../app/router/paths'
import { appRoutes } from '../../app/router/router'
import {
  createAccount,
  loginWithEmail,
  loginWithGoogle,
  logout,
} from '../../features/auth/model/auth'

const authState = vi.hoisted(() => ({
  user: null as null | { uid: string },
}))

vi.mock('../../features/auth/model/auth', () => ({
  createAccount: vi.fn(),
  getAuthenticationErrorMessage: vi.fn(() => '認証処理に失敗しました。'),
  loginWithEmail: vi.fn(),
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  observeAuthState: vi.fn(
    (callback: (user: null | { uid: string }) => void) => {
      callback(authState.user)
      return () => undefined
    },
  ),
  requestPasswordReset: vi.fn(),
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  authState.user = null
})

describe('LoginPage', () => {
  const renderRoute = (path: string) => {
    const router = createMemoryRouter(appRoutes, { initialEntries: [path] })
    render(<RouterProvider router={router} />)
    return router
  }

  it('ログインフォームを表示する', () => {
    renderRoute('/login')

    expect(screen.queryByLabelText('Voltech')).toBeNull()
    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeTruthy()
    expect(screen.getByLabelText('メールアドレス')).toBeTruthy()
    expect(screen.getByLabelText('パスワード')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Googleでログイン' })).toBeTruthy()
  })

  it('ルートパスに元の画面を表示する', () => {
    renderRoute(paths.dashboard)

    expect(screen.getByRole('heading', { name: 'Get started' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'ログイン' })).toBeNull()
  })

  it('アカウント作成ページへ遷移できる', async () => {
    const user = userEvent.setup()
    const router = renderRoute('/login')

    await user.click(screen.getByRole('link', { name: 'アカウント作成' }))

    expect(screen.getByRole('heading', { name: 'アカウントを作成' })).toBeTruthy()
    expect(screen.getByLabelText('パスワード（確認）')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Googleでアカウント作成' }),
    ).toBeTruthy()
    expect(router.state.location.pathname).toBe('/signup')
  })

  it('パスワードの表示と非表示を切り替えられる', async () => {
    const user = userEvent.setup()
    renderRoute('/login')
    const passwordInput = screen.getByLabelText('パスワード')

    expect(passwordInput.getAttribute('type')).toBe('password')

    await user.click(screen.getByRole('button', { name: 'パスワードを表示' }))

    expect(passwordInput.getAttribute('type')).toBe('text')
    expect(screen.getByRole('button', { name: 'パスワードを隠す' })).toBeTruthy()
  })

  it('メールアドレスとパスワードでログインできる', async () => {
    const user = userEvent.setup()
    const router = renderRoute('/login')

    await user.type(screen.getByLabelText('メールアドレス'), 'user@example.com')
    await user.type(screen.getByLabelText('パスワード'), 'password123')
    await user.click(screen.getByLabelText('ログイン状態を保持する'))
    await user.click(screen.getByRole('button', { name: 'ログイン' }))

    await waitFor(() => {
      expect(loginWithEmail).toHaveBeenCalledWith(
        'user@example.com',
        'password123',
        true,
      )
      expect(router.state.location.pathname).toBe(paths.dashboard)
    })
  })

  it('メールアドレスとパスワードでアカウントを作成できる', async () => {
    const user = userEvent.setup()
    const router = renderRoute('/signup')

    await user.type(screen.getByLabelText('メールアドレス'), 'user@example.com')
    await user.type(screen.getByLabelText('パスワード'), 'password123')
    await user.type(screen.getByLabelText('パスワード（確認）'), 'password123')
    await user.click(screen.getByRole('button', { name: 'アカウントを作成' }))

    await waitFor(() => {
      expect(createAccount).toHaveBeenCalledWith(
        'user@example.com',
        'password123',
      )
      expect(router.state.location.pathname).toBe(paths.dashboard)
    })
  })

  it('確認用パスワードが一致しない場合はアカウントを作成しない', async () => {
    const user = userEvent.setup()
    renderRoute('/signup')

    await user.type(screen.getByLabelText('メールアドレス'), 'user@example.com')
    await user.type(screen.getByLabelText('パスワード'), 'password123')
    await user.type(screen.getByLabelText('パスワード（確認）'), 'password456')
    await user.click(screen.getByRole('button', { name: 'アカウントを作成' }))

    expect(screen.getByRole('alert').textContent).toBe(
      '確認用パスワードが一致しません。',
    )
    expect(createAccount).not.toHaveBeenCalled()
  })

  it('Googleログイン後にダッシュボードへ遷移する', async () => {
    const user = userEvent.setup()
    const router = renderRoute('/login')

    await user.click(screen.getByRole('button', { name: 'Googleでログイン' }))

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalledOnce()
      expect(router.state.location.pathname).toBe(paths.dashboard)
    })
  })

  it('ログアウト後にログインページへ遷移する', async () => {
    authState.user = { uid: 'firebase-user' }
    const user = userEvent.setup()
    const router = renderRoute(paths.dashboard)

    await user.click(await screen.findByRole('button', { name: 'ログアウト' }))

    await waitFor(() => {
      expect(logout).toHaveBeenCalledOnce()
      expect(router.state.location.pathname).toBe(paths.login)
    })
  })
})
