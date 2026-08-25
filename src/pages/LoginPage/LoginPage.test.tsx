import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { paths } from '../../app/router/paths'
import { appRoutes } from '../../app/router/router'

afterEach(cleanup)

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
})
