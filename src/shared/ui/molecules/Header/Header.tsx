import { Link } from 'react-router'
import { paths } from '../../../../app/router/paths'
import HeaderLink from '../../atoms/HeaderLink/HeaderLink.tsx'
import styles from './Header.module.css'

type NavItem = {
  label: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'ダッシュボード', path: paths.dashboard },
  { label: 'カレンダー', path: paths.calendar },
  { label: 'グループ', path: paths.group },
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
