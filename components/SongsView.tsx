'use client'

import { useState } from 'react'
import type { SingerWithSongs, Song } from '@/types/database.types'
import { generateKaraokeUrl, getTextDirection } from '@/utils/language'
import { deleteSinger, deleteSong } from '@/app/actions/data'
import { ConfirmModal } from './ConfirmModal'
import styles from './SongsView.module.css'

interface SongsViewProps {
  singer: SingerWithSongs
  onUpdate: (singer: SingerWithSongs) => void
  onDelete: (singerId: string) => void
}

type DeleteAction = 
  | { type: 'singer'; singerId: string; singerName: string }
  | { type: 'song'; songId: string; songTitle: string }
  | null

export function SongsView({ singer, onUpdate, onDelete }: SongsViewProps) {
  const [loading, setLoading] = useState(false)
  const [deleteAction, setDeleteAction] = useState<DeleteAction>(null)

  const handleSongClick = (song: Song) => {
    const url = generateKaraokeUrl(song.title, singer.name, song.language)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleDeleteSinger = async () => {
    setLoading(true)
    setDeleteAction(null)
    const result = await deleteSinger(singer.id)
    setLoading(false)

    if (!result.error) {
      onDelete(singer.id)
    } else {
      alert('Failed to delete singer: ' + result.error)
    }
  }

  const handleDeleteSong = async (songId: string) => {
    setLoading(true)
    setDeleteAction(null)
    const result = await deleteSong(songId)
    setLoading(false)

    if (!result.error) {
      const updatedSinger = {
        ...singer,
        songs: singer.songs.filter((s) => s.id !== songId),
      }
      onUpdate(updatedSinger)
    } else {
      alert('Failed to delete song: ' + result.error)
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.singerImageLarge}>
            {singer.image_url ? (
              <img src={singer.image_url} alt={singer.name} />
            ) : (
              '🎤'
            )}
          </div>
          <div className={styles.singerDetails}>
            <div className={styles.singerType}>Singer</div>
            <h1 className={styles.singerName}>{singer.name}</h1>
            <div className={styles.singerStats}>
              {singer.songs.length} {singer.songs.length === 1 ? 'song' : 'songs'}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => setDeleteAction({ type: 'singer', singerId: singer.id, singerName: singer.name })}
            className={styles.deleteButton}
            disabled={loading}
          >
            Delete Singer
          </button>
        </div>

        <div className={styles.songsSection}>
          <div className={styles.songsHeader}>
            <div className={styles.columnNumber}>#</div>
            <div className={styles.columnTitle}>Title</div>
            <div className={styles.columnLanguage}>Language</div>
            <div className={styles.columnActions}></div>
          </div>

          {singer.songs.length === 0 ? (
            <div className={styles.noSongs}>
              <p>No songs yet for this singer</p>
            </div>
          ) : (
            <div className={styles.songsList}>
              {singer.songs.map((song, index) => (
                <div
                  key={song.id}
                  className={styles.songRow}
                  dir={getTextDirection(song.language)}
                >
                  <div className={styles.songNumber}>{index + 1}</div>
                  <button
                    onClick={() => handleSongClick(song)}
                    className={styles.songTitle}
                    disabled={loading}
                  >
                    {song.title}
                  </button>
                  <div className={styles.songLanguage}>
                    {song.language === 'he' ? '🇮🇱 Hebrew' : '🇬🇧 English'}
                  </div>
                  <div className={styles.songActions}>
                    <button
                      onClick={() => setDeleteAction({ type: 'song', songId: song.id, songTitle: song.title })}
                      className={styles.deleteSongButton}
                      disabled={loading}
                      title="Delete song"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteAction && deleteAction.type === 'singer' && (
        <ConfirmModal
          title="Delete Singer"
          message={`Are you sure you want to delete "${deleteAction.singerName}" and all their songs? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive
          onConfirm={handleDeleteSinger}
          onCancel={() => setDeleteAction(null)}
        />
      )}

      {deleteAction && deleteAction.type === 'song' && (
        <ConfirmModal
          title="Delete Song"
          message={`Are you sure you want to delete "${deleteAction.songTitle}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive
          onConfirm={() => handleDeleteSong(deleteAction.songId)}
          onCancel={() => setDeleteAction(null)}
        />
      )}
    </>
  )
}

