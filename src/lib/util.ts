import type { Tag } from 'carbon-components-svelte'
import type { ComponentProps, SvelteComponent } from 'svelte'

export interface ActionItem {
  label: string
  icon?: typeof SvelteComponent<any>
  href?: string
  onClick?: () => void
  disabled?: boolean
}

export interface TagItem {
  label: string
  type?: ComponentProps<Tag>['type']
  icon?: typeof SvelteComponent<any>
  onClick?: () => void
}

export interface NavigationItem {
  label: string
  href: string
  icon?: typeof SvelteComponent<any>
  disabled?: boolean
}

export interface ShellItem extends NavigationItem {
  group?: string
}
