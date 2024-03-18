import { dateDeserialize, datetimeDeserialize } from '@txstate-mws/svelte-forms'
import { DateTime } from 'luxon'
import { isNotBlank } from 'txstate-utils'

export function luxonDateDeserialize (v: string, tz?: string) {
  const dt = dateDeserialize(v)
  if (dt == null) return undefined
  dt.toJSON = function () {
    let ldt = DateTime.fromJSDate(this)
    if (isNotBlank(tz)) {
      ldt = ldt.setZone(tz, { keepLocalTime: true })
    }
    return ldt.toISO()!
  }
  return dt
}

export function luxonDateTimeDeserialize (v: string, tz?: string) {
  const dt = datetimeDeserialize(v)
  if (dt == null) return undefined
  dt.toJSON = function () {
    let ldt = DateTime.fromJSDate(this)
    if (isNotBlank(tz)) {
      ldt = ldt.setZone(tz, { keepLocalTime: true })
    }
    return ldt.toISO()!
  }
  return dt
}
