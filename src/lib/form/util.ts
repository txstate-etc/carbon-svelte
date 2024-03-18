import { isBlank } from 'txstate-utils'

export function feedbackTypeToKind (type: any) {
  return {
    error: 'error' as const,
    warning: 'warning' as const,
    success: 'success' as const,
    system: 'error' as const
  }[type as string] ?? 'error'
}

export function to24Hour (time: string, ampm: 'am' | 'pm') {
  if (isBlank(time)) return undefined
  const m = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return undefined
  let hour = Number(m[1])
  const minute = m[2]
  if (hour === 12 && ampm === 'am') hour = 0
  else if (ampm === 'pm' && hour < 12) hour += 12
  if (hour > 23) return undefined
  return `${String(hour).padStart(2, '0')}:${minute}`
}
