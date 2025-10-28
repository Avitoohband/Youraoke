'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { SingerWithSongs } from '@/types/database.types'
import { SongsView } from './SongsView'
import { AddSongForm } from './AddSongForm'
import { ConfirmModal } from './ConfirmModal'
import { logout } from '@/app/actions/auth'
import { isHebrew } from '@/utils/language'
import styles from './DashboardClient.module.css'

interface DashboardClientProps {
  initialSingers: SingerWithSongs[]
  userEmail: string
}

type SingerGroup = {
  type: 'hebrew' | 'english'
  singers: SingerWithSongs[]
}

export function DashboardClient({ initialSingers, userEmail }: DashboardClientProps) {
  const [singers, setSingers] = useState<SingerWithSongs[]>(initialSingers)
  const [selectedSingerId, setSelectedSingerId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setShowLogoutConfirm(false)
    await logout()
    router.push('/login')
    router.refresh()
  }

  const handleSingerUpdate = (updatedSinger: SingerWithSongs) => {
    setSingers((prev) =>
      prev.map((s) => (s.id === updatedSinger.id ? updatedSinger : s))
    )
  }

  const handleSingerAdd = (newSinger: SingerWithSongs) => {
    setSingers((prev) => [...prev, newSinger])
    setSelectedSingerId(newSinger.id)
  }

  const handleSingerDelete = (singerId: string) => {
    setSingers((prev) => prev.filter((s) => s.id !== singerId))
    if (selectedSingerId === singerId) {
      setSelectedSingerId(null)
    }
  }

  // Group and sort singers by language
  const groupedSingers = useMemo(() => {
    const hebrew: SingerWithSongs[] = []
    const english: SingerWithSongs[] = []

    singers.forEach((singer) => {
      if (isHebrew(singer.name)) {
        hebrew.push(singer)
      } else {
        english.push(singer)
      }
    })

    // Sort Hebrew singers (א-ת)
    hebrew.sort((a, b) => a.name.localeCompare(b.name, 'he'))
    // Sort English singers (A-Z)
    english.sort((a, b) => a.name.localeCompare(b.name, 'en'))

    const groups: SingerGroup[] = []
    if (hebrew.length > 0) {
      groups.push({ type: 'hebrew', singers: hebrew })
    }
    if (english.length > 0) {
      groups.push({ type: 'english', singers: english })
    }

    return groups
  }, [singers])

  const selectedSinger = singers.find((s) => s.id === selectedSingerId)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>🎤 Youraoke</h1>
          <div className={styles.userInfo}>
            <span className={styles.email}>{userEmail}</span>
            <button onClick={() => setShowLogoutConfirm(true)} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Your Library</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className={styles.addButton}
              title="Add song"
            >
              +
            </button>
          </div>

          <div className={styles.singersList}>
            {singers.length === 0 ? (
              <div className={styles.emptyLibrary}>
                <p>No singers yet</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className={styles.emptyButton}
                >
                  Add Your First Song
                </button>
              </div>
            ) : (
              groupedSingers.map((group, groupIndex) => (
                <div key={group.type} className={styles.singerGroup}>
                  <div className={styles.groupHeader}>
                    {group.type === 'hebrew' ? '--- עברית ---' : '--- English ---'}
                  </div>
                  {group.singers.map((singer) => (
                    <button
                      key={singer.id}
                      onClick={() => setSelectedSingerId(singer.id)}
                      className={`${styles.singerItem} ${
                        selectedSingerId === singer.id ? styles.singerItemActive : ''
                      }`}
                      dir={group.type === 'hebrew' ? 'rtl' : 'ltr'}
                    >
                      <div className={styles.singerImage}>
                        {singer.image_url ? (
                          <img src={singer.image_url} alt={singer.name} />
                        ) : (
                          '🎤'
                        )}
                      </div>
                      <div className={styles.singerInfo}>
                        <div className={styles.singerName}>{singer.name}</div>
                        <div className={styles.singerSongCount}>
                          {singer.songs.length} {singer.songs.length === 1 ? 'song' : 'songs'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </aside>

        <main className={styles.main}>
          {selectedSinger ? (
            <SongsView
              singer={selectedSinger}
              onUpdate={handleSingerUpdate}
              onDelete={handleSingerDelete}
            />
          ) : (
            <div className={styles.emptyMain}>
              <div className={styles.emptyIcon}>🎵</div>
              <h2>Select a singer</h2>
              <p>Choose a singer from the library to view their songs</p>
              {singers.length === 0 && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className={styles.emptyMainButton}
                >
                  Add Your First Song
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {showAddForm && (
        <AddSongForm
          existingSingers={singers}
          onClose={() => setShowAddForm(false)}
          onSingerAdd={handleSingerAdd}
          onSingerUpdate={handleSingerUpdate}
        />
      )}

      {showLogoutConfirm && (
        <ConfirmModal
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  )
}

