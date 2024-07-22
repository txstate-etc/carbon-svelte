import type { Tag } from 'carbon-components-svelte'
import type { ComponentProps, SvelteComponent } from 'svelte'
import { fromQuery, isNotEmpty, isNotBlank, toQuery } from 'txstate-utils'

export interface ActionItem {
  label: string
  icon?: typeof SvelteComponent<any>
  href?: string
  onClick?: () => void | Promise<void>
  disabled?: boolean
}

export interface TagItem {
  label: string
  type?: ComponentProps<Tag>['type'] | 'yellow'
  icon?: typeof SvelteComponent<any>
  onClick?: () => void | Promise<void>
}

export interface TabRadioItem {
  label: string
  icon?: typeof SvelteComponent<any>
  value: any
  disabled?: boolean
}

export interface TabLinkItem {
  label: string
  icon?: typeof SvelteComponent<any>
  href: string
  disabled?: boolean
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

export interface ColumnDefinition<T> {
  id: string
  label: string

  /**
   * One of the two options for specifying the width of the column. Sets the column
   * to a fixed width regardless of which other columns are present.
   *
   * Provide any CSS size string, e.g. '22rem' or '15%' or '50px'.
   *
   * Use sparingly, and generally for small columns. If the fixed width of all columns is
   * greater than what's available on screen, columns will not line up properly from
   * row to row.
   *
   * Also note that checkbox and action columns are automatic and will add to your row width,
   * so if you provide a `fixed` for every column and it adds to 100%, the checkbox or action
   * column may push you over 100%.
   */
  fixed?: string
  /**
   * After all fixed columns have their width, the remaining available width on screen will
   * be divided among columns that use grow. Provide a number that reflects how many shares
   * this column should receive. For instance, if two columns use `grow`, one with `grow: 4`
   * and one with `grow: 6`, the one with `grow: 4` will receive 40% of the remaining available
   * width after fixed columns are accounted for, and the one with `grow: 6` will receive 60%.
   *
   * If you do not provide either `fixed` or `grow`, the default is `grow: 1`.
   */
  grow?: number

  /**
   * One of four options for specifying the content of a cell. Specify a property name
   * or a dot-separated path. The content of the cell will be the value of that property/path
   * in the row object.
   */
  get?: string
  /**
   * Second of four options for specifying the content of a cell. Provide a function that accepts
   * a row object and returns HTML for the cell content.
   */
  render?: (row: T) => string
  /**
   * Third of four options for specifying the content of a cell. Provide a Svelte component. It will
   * be given the row object as a prop named `row`.
   */
  component?: typeof SvelteComponent<any>
  /**
   * Last of four options for specifying the content of a cell. Provide a function that accepts
   * a row object and returns an array of tags you would like rendered in the cell. All interactive tags
   * in a row will be grouped into a single set for keyboard users to arrow through.
   */
  tags?: (row: T) => TagItem[]

  /**
   * Add an icon to the beginning of the cell content. Works in tandem with one of the four options for specifying
   * cell content.
   */
  icon?: { icon: typeof SvelteComponent<any>, label?: string } | ((row: T) => { icon: typeof SvelteComponent<any>, label?: string } | undefined)
  /**
   * Wrap the entire cell in a link. Works in tandem with one of the four options for specifying cell content.
   * Probably not a good idea to provide this for a cell containing interactive elements.
   */
  href?: (row: T) => undefined | string
  /**
   * Wrap the entire cell in a button. Works in tandem with one of the four options for specifying cell content.
   * Probably not a good idea to provide this for a cell containing interactive elements.
   *
   * If you provide both an href and an onClick, the cell will be wrapped with an `a` tag and the onClick be placed on
   * it. The onClick will fire but not necessarily before the navigation begins.
   */
  onClick?: (row: T) => undefined | string

  /**
   * Optionally add a CSS class to the cell's container. It will not necessarily be a td.
   *
   * If you provide a function, it will be called once without a row and you can return a class for the
   * column header cell.
   */
  class?: string | ((row?: T) => undefined | string | string[])
}

function shouldKeep (payload: any) {
  if (payload == null) return false
  if (typeof payload === 'string') return isNotBlank(payload)
  if (typeof payload === 'boolean') return true
  if (typeof payload === 'number') return true
  if (payload instanceof Date) return true
  return isNotEmpty(payload)
}

export function deleteEmpty (payload: any): any {
  if (typeof payload === 'object') {
    if (Array.isArray(payload)) {
      return payload.map(deleteEmpty).filter(shouldKeep)
    } else {
      return Object.fromEntries(Object.entries(payload).map(([key, val]) => [key, deleteEmpty(val)]).filter(([key, val]) => shouldKeep(val)))
    }
  }
  return payload
}

export interface FilterUIFilters {
  f?: any
  q?: any
  t?: any
  search?: string
}

export function extractFilters (url: URL) {
  return fromQuery(url.search.substring(1)) as FilterUIFilters
}

export function extractMergedFilters (url: URL) {
  const params = extractFilters(url)
  return { ...params.f, ...params.q, ...params.t, search: params.search }
}

export function addFilters (url: URL, filters: FilterUIFilters) {
  const ret = new URL(url)
  const str = toQuery(deleteEmpty(filters))
  console.log(filters, deleteEmpty(filters), str)
  const restofquery = url.search.substring(1).split('&').filter(entry => isNotBlank(entry) && !entry.startsWith('f.') && !entry.startsWith('q.') && !entry.startsWith('t.') && !entry.startsWith('search='))
  ret.search = [str, ...restofquery].join('&')
  return ret
}
