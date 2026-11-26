import * as React from 'react'

const ACTION_DELAY_MS = 700

/** Keeps a confirm/submit button in a loading state long enough to show a spinner. */
export function useActionLoading(active = true) {
  const [isLoading, setIsLoading] = React.useState(false)
  const loadingRef = React.useRef(false)

  React.useEffect(() => {
    if (!active) {
      loadingRef.current = false
      setIsLoading(false)
    }
  }, [active])

  const run = React.useCallback((action: () => void) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setIsLoading(true)
    window.setTimeout(() => {
      action()
      loadingRef.current = false
      setIsLoading(false)
    }, ACTION_DELAY_MS)
  }, [])

  return { isLoading, run }
}
