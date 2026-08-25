import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { logout } from '../../../../features/auth/model/auth'
import { useCurrentUser } from '../../../../features/auth/model/useCurrentUser'
import HeaderLink from '../../atoms/HeaderLink/HeaderLink.tsx'
import styles from './Header.module.css'

type NavItem = {
  label: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'ダッシュボード', path: '/dashboard' },
  { label: 'カレンダー', path: '/calendar' },
  { label: 'グループ', path: '/group' },
]

export default function Header() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className={styles.header}>
      {/* ロゴ */}
      <Link to="/" className={styles.logoLink} aria-label="トップページへ">
        <span className={styles.logoText}>Burning Limit</span>
      </Link>

      {/* ナビゲーションメニュー */}
      <nav className={styles.navContainer} aria-label="メインナビゲーション">
        {NAV_ITEMS.map((item) => (
          <HeaderLink
            key={item.path}
            to={item.path}
            className={styles.navItem}
          >
            {item.label}
          </HeaderLink>
        ))}
      </nav>

      <div className={styles.avatarContainer}>
        {user ? (
          <>
            <Link
              to="/profile"
              className={styles.avatarLink}
              aria-label="プロフィールへ"
            >
              <div className={styles.avatarPlaceholder} />
            </Link>
            <button
              className={styles.logoutButton}
              type="button"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              <LogOut aria-hidden="true" />
              ログアウト
            </button>
          </>
        ) : (
          <Link className={styles.loginLink} to="/login">
            ログイン
          </Link>
        )}
      </div>
    </header>
  )
}
