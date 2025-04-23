import { ReactNode, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import styles from './TrackFormModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const modalRoot = document.getElementById('modal-root')!

const TrackFormModal = ({ isOpen, onClose, children }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    modalRoot
  )
}

export default TrackFormModal
