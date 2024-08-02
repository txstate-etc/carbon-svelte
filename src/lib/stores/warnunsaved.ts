import type { NavigationTarget } from '@sveltejs/kit'
import { writable } from 'svelte/store'

class WarnUnsaved {
  #allowNavigate = false
  pendingNavigate?: NavigationTarget

  get allowNavigate () {
    return this.#allowNavigate
  }

  set allowNavigate (val: boolean) {
    this.#allowNavigate = val
    if (val) setTimeout(() => { this.#allowNavigate = false }, 100)
  }
}
export const warnunsaved = new WarnUnsaved()
export const unsavedDialogOpen = writable(false)
