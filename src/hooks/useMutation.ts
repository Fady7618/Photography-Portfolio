'use client'

import { useState } from 'react'

type MutationState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

type MutateOptions = {
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
}

type MutationResult<T> = {
  data: T | null
  status: number
}

export function useMutation<TData, TInput>(
  url: string,
  options: MutateOptions = {}
) {
  const [state, setState] = useState<MutationState<TData>>({
    data: null,
    loading: false,
    error: null,
  })

  async function mutate(input: TInput): Promise<MutationResult<TData>> {
    setState({ data: null, loading: true, error: null })

    try {
      const res = await fetch(url, {
        method: options.method ?? 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      const json = await res.json()

      if (!res.ok) {
        setState({
          data: null,
          loading: false,
          error: json.error ?? 'Request failed',
        })
        return { data: null, status: res.status }
      }

      setState({ data: json, loading: false, error: null })
      return { data: json, status: res.status }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error'
      setState({ data: null, loading: false, error: message })
      return { data: null, status: 0 }
    }
  }

  return { ...state, mutate }
}
