import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HeaderButton from './HeaderButton'

afterEach(cleanup)

describe('HeaderButton', () => {
  it('子要素を表示し、デフォルトでbuttonとして動作する', () => {
    render(<HeaderButton>メニュー</HeaderButton>)

    const button = screen.getByRole('button', { name: 'メニュー' })

    expect(button.getAttribute('type')).toBe('button')
  })

  it('buttonの標準属性と追加のclassNameを引き継ぐ', () => {
    render(
      <HeaderButton aria-label="通知" className="custom-class" type="submit">
        通知アイコン
      </HeaderButton>,
    )

    const button = screen.getByRole('button', { name: '通知' })

    expect(button.getAttribute('type')).toBe('submit')
    expect(button.classList.contains('custom-class')).toBe(true)
  })

  it('クリック時にonClickを呼び出す', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<HeaderButton onClick={handleClick}>プロフィール</HeaderButton>)

    await user.click(screen.getByRole('button', { name: 'プロフィール' }))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('disabledの場合はクリック処理を呼び出さない', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <HeaderButton disabled onClick={handleClick}>
        ログアウト
      </HeaderButton>,
    )

    await user.click(screen.getByRole('button', { name: 'ログアウト' }))

    expect(handleClick).not.toHaveBeenCalled()
  })
})
