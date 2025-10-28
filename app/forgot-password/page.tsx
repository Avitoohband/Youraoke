import { ForgotPasswordForm } from '@/components/ForgotPasswordForm'
import styles from '../login/auth.module.css'

export default function ForgotPasswordPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>🎤 Youraoke</h1>
          <p className={styles.subtitle}>Reset your password</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

