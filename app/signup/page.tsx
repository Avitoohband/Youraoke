import { AuthForm } from '@/components/AuthForm'
import styles from '../login/auth.module.css'

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>🎤 Youraoke</h1>
          <p className={styles.subtitle}>Create your account</p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}

