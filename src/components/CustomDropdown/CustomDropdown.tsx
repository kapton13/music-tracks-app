import { useState, useRef, useEffect } from 'react'

import styles from './CustomDropdown.module.css'

interface DropdownProps<T> {
  items: T[]
  selected: T
  onChange: (value: T) => void
  labelKey?: (item: T) => string
  valueKey?: (item: T) => string
  loading?: boolean
  placeholder?: string
}

function CustomDropdown<T>({
  items,
  selected,
  onChange,
  labelKey = (item: T) => String(item),
  valueKey = (item: T) => String(item),
  loading = false,
  placeholder
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayLabel = loading
    ? (placeholder || 'Loading...')
    : labelKey(selected)

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        type="button"
        className={styles.dropdownButton}
        onClick={() => setOpen(prev => !prev)}
        data-testid="dropdown-toggle"
      >
        {displayLabel}
        <span className={styles.caret}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul className={styles.menu} data-testid="dropdown-menu">
          {loading
            ? <li className={styles.menuItemDisabled}>Loading...</li>
            : items.map(item => {
                const val = valueKey(item)
                return (
                  <li
                    key={val}
                    className={`${styles.menuItem} ${val === valueKey(selected) ? styles.active : ''}`}
                    onClick={() => { onChange(item); setOpen(false) }}
                    data-testid={`dropdown-item-${val}`}
                  >
                    {labelKey(item)}
                  </li>
                )
              })
          }
        </ul>
      )}
    </div>
  )
}

export default CustomDropdown