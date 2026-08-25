import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../../shared/ui/molecules/Header/Header'
import styles from './BaseLayout.module.css'

interface BaseLayoutProps {
  children?: ReactNode
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {/* React Router経由のページ表示、または直接渡された children を描画 */}
        {children ?? <Outlet />}
      </main>
    </div>
  )
}