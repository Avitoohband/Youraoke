import { AuthForm } from '@/components/AuthForm'
import styles from './auth.module.css'

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>🎤 Youraoke</h1>
          <p className={styles.subtitle}>Your Karaoke Companion</p>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  )
}

