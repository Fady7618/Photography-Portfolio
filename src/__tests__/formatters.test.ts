import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  formatBytes,
  formatDateShort,
  toISODate,
  isSameCalendarDay,
} from '@/utils/formatters'

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
    )
  })

  it('escapes ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })
})

describe('formatBytes', () => {
  it('formats kilobytes below 1 MB', () => {
    expect(formatBytes(512 * 1024)).toBe('512.0 KB')
  })

  it('formats megabytes', () => {
    expect(formatBytes(2 * 1024 * 1024)).toBe('2.0 MB')
  })
})

describe('formatDateShort', () => {
  it('formats a date string', () => {
    const formatted = formatDateShort('2026-06-15')
    expect(formatted).toContain('2026')
  })
})

describe('toISODate', () => {
  it('returns YYYY-MM-DD', () => {
    expect(toISODate(new Date(2026, 5, 15))).toBe('2026-06-15')
  })
})

describe('isSameCalendarDay', () => {
  it('returns true for same calendar day', () => {
    const a = new Date(2026, 5, 15, 10, 0)
    const b = new Date(2026, 5, 15, 22, 0)
    expect(isSameCalendarDay(a, b)).toBe(true)
  })

  it('returns false for different days', () => {
    const a = new Date(2026, 5, 15)
    const b = new Date(2026, 5, 16)
    expect(isSameCalendarDay(a, b)).toBe(false)
  })
})
