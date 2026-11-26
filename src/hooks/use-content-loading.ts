import * as React from 'react'

/** Brief first-paint loading state for tables, cards, and page sections. */
export function useContentLoading(delay = 700) {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const id = window.setTimeout(() => setIsLoading(false), delay)
    return () => window.clearTimeout(id)
  }, [delay])

  return isLoading
}
