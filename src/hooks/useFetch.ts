import { useState, useEffect } from 'react'

type FetchState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json() as Promise<T>
      })
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }) })
      .catch((err) => { if (!cancelled) setState({ data: null, loading: false, error: err.message }) })

    return () => { cancelled = true }
  }, [url])

  return state
}
