'use client'

import { useState, useMemo } from 'react'
import type { SingerWithSongs } from '@/types/database.types'
import { detectLanguage } from '@/utils/language'
import { formatSingerName, formatSongTitle } from '@/utils/format'
import { addSinger, addSong } from '@/app/actions/data'
import styles from './AddSongForm.module.css'

interface AddSongFormProps {
  existingSingers: SingerWithSongs[]
  onClose: () => void
  onSingerAdd: (singer: SingerWithSongs) => void
  onSingerUpdate: (singer: SingerWithSongs) => void
}

export function AddSongForm({
  existingSingers,
  onClose,
  onSingerAdd,
  onSingerUpdate,
}: AddSongFormProps) {
  const [singerName, setSingerName] = useState('')
  const [songTitle, setSongTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-detect if singer exists (case-insensitive)
  const existingSinger = useMemo(() => {
    if (!singerName.trim()) return null
    return existingSingers.find(
      (s) => s.name.toLowerCase() === singerName.trim().toLowerCase()
    )
  }, [singerName, existingSingers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!singerName.trim() || !songTitle.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Format names with title case for English
      const formattedSingerName = formatSingerName(singerName)
      const formattedSongTitle = formatSongTitle(songTitle)
      const language = detectLanguage(songTitle)

      if (existingSinger) {
        // Add song to existing singer
        const result = await addSong(existingSinger.id, formattedSongTitle, language)
        
        if (result.error) {
          setError(result.error)
        } else if (result.song) {
          const updatedSinger = {
            ...existingSinger,
            songs: [...existingSinger.songs, result.song],
          }
          onSingerUpdate(updatedSinger)
          onClose()
        }
      } else {
        // Create new singer and add song
        const result = await addSinger(formattedSingerName, formattedSongTitle, language)
        
        if (result.error) {
          setError(result.error)
        } else if (result.singer && result.song) {
          const newSinger: SingerWithSongs = {
            ...result.singer,
            songs: [result.song],
          }
          onSingerAdd(newSinger)
          onClose()
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Song</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="singerName" className={styles.label}>
              Singer Name
            </label>
            <input
              id="singerName"
              type="text"
              value={singerName}
              onChange={(e) => setSingerName(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter singer name"
              disabled={loading}
              list="singers-list"
            />
            <datalist id="singers-list">
              {existingSingers.map((singer) => (
                <option key={singer.id} value={singer.name} />
              ))}
            </datalist>
            {existingSinger && (
              <p className={styles.info}>
                ✓ Will add to existing singer: <strong>{existingSinger.name}</strong>
              </p>
            )}
            {singerName.trim() && !existingSinger && (
              <p className={styles.info}>
                ✨ Will create new singer: <strong>{singerName}</strong>
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="songTitle" className={styles.label}>
              Song Title
            </label>
            <input
              id="songTitle"
              type="text"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter song title"
              disabled={loading}
            />
            <p className={styles.hint}>
              Language will be auto-detected (English or Hebrew)
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Song'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

