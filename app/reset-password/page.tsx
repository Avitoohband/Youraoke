import { ResetPasswordForm } from '@/components/ResetPasswordForm'
import styles from '../login/auth.module.css'

export default function ResetPasswordPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>🎤 Youraoke</h1>
          <p className={styles.subtitle}>Set your new password</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}

