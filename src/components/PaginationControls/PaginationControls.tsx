import styles from './PaginationControls.module.css'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PaginationControls = ({ page, totalPages, onPageChange }: Props) => {
  const renderPageButtons = () => {
    const delta = 2
    const rangeWithDots: (number | string)[] = []

    const left = Math.max(2, page - delta)
    const right = Math.min(totalPages - 1, page + delta)

    if (left > 2) {
      rangeWithDots.push(1, '...')
    } else {
      for (let i = 1; i < left; i++) {
        rangeWithDots.push(i)
      }
    }

    for (let i = left; i <= right; i++) {
      rangeWithDots.push(i)
    }

    if (right < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      for (let i = right + 1; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    }

    return rangeWithDots.map((item, index) => {
      if (typeof item === 'string') {
        return (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            {item}
          </span>
        )
      }

      return (
        <button
          key={item}
          className={`${styles.pageButton} ${item === page ? styles.active : ''}`}
          onClick={() => onPageChange(item)}
          disabled={item === page}
          data-testid={`page-button-${item}`}
        >
          {item}
        </button>
      )
    })
  }

  return (
    <div className={styles.paginationContainer} data-testid="pagination">
      <button
        data-testid="pagination-prev"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={styles.navButton}
      >
        &lt; Prev
      </button>

      <div className={styles.pageNumbers}>{renderPageButtons()}</div>

      <button
        data-testid="pagination-next"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={styles.navButton}
      >
        Next &gt;
      </button>
    </div>
  )
}

export default PaginationControls