import { Link } from 'react-router-dom'
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

      {/* ユーザーログイン部要改修 */}
      <div className={styles.avatarContainer}>
        <Link to="/profile" className={styles.avatarLink} aria-label="プロフィールへ">
          <div className={styles.avatarPlaceholder} />
        </Link>
      </div>
    </header>
  )
}