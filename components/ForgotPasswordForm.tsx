'use client'

import { useState } from 'react'
import styles from './AuthForm.module.css'
import { resetPassword } from '@/app/actions/auth'
import { LoadingSpinner } from './LoadingSpinner'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await resetPassword(email)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.form}>
        <div className={styles.success}>
          <p>✅ Password reset email sent!</p>
          <p>Check your email for a link to reset your password.</p>
        </div>
        <div className={styles.footer}>
          <p>
            <a href="/login" className={styles.link}>
              Back to login
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          placeholder="your@email.com"
          disabled={loading}
        />
        <p className={styles.hint}>
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? (
          <span className={styles.buttonContent}>
            <LoadingSpinner size="small" />
            <span>Sending...</span>
          </span>
        ) : (
          'Send Reset Link'
        )}
      </button>

      <div className={styles.footer}>
        <p>
          Remember your password?{' '}
          <a href="/login" className={styles.link}>
            Sign in
          </a>
        </p>
      </div>
    </form>
  )
}

