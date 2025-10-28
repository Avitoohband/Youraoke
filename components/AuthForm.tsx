'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './AuthForm.module.css'
import { login, signup } from '@/app/actions/auth'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        const result = await login(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        const result = await signup(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          // Show success message for signup
          setError('Check your email to confirm your account!')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
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
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className={styles.input}
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      {error && (
        <div className={error.includes('Check your email') ? styles.success : styles.error}>
          {error}
        </div>
      )}

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
      </button>

      <div className={styles.footer}>
        {mode === 'login' ? (
          <p>
            Don't have an account?{' '}
            <a href="/signup" className={styles.link}>
              Sign up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a href="/login" className={styles.link}>
              Sign in
            </a>
          </p>
        )}
      </div>
    </form>
  )
}

