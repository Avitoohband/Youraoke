'use client'

import styles from './ConfirmModal.module.css'

interface ConfirmModalProps {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isDestructive?: boolean
}

export function ConfirmModal({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmModalProps) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <button
            onClick={onCancel}
            className={styles.cancelButton}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={isDestructive ? styles.deleteButton : styles.confirmButton}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

