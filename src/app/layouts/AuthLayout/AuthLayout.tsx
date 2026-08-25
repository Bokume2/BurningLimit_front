import { Outlet } from 'react-router'
import styles from './AuthLayout.module.css'

export default function AuthLayout() {
  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <Outlet />
      </section>
    </main>
  )
}
