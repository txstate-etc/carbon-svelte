import { deflateSync, inflateSync } from 'fflate'
import { base64ToBase64Url, base64urlTobase64, isEmpty, isNotEmpty, stringify } from 'txstate-utils'
import { deleteEmpty } from './util.js'

export function compactStringify (payload: Record<string, any>) {
  const cleaned = deleteEmpty(payload)
  if (isEmpty(cleaned)) return ''
  const text = stringify(cleaned).slice(1, -1)
  const compressed = deflateSync(new TextEncoder().encode(text))
  return base64ToBase64Url(btoa(String.fromCharCode(...compressed)))
}

export function compactParse <T = any> (base64url: string) {
  if (!base64url) return {}
  const base64 = base64urlTobase64(base64url)
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
  const base64WithPadding = base64 + padding
  const binary = atob(base64WithPadding)
  const uintarray = Uint8Array.from(binary, c => c.charCodeAt(0))
  return JSON.parse('{' + new TextDecoder().decode(inflateSync(uintarray)) + '}') as Record<string, T>
}
