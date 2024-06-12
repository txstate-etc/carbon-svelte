import type { Page } from '@sveltejs/kit'
import { Store, derivedStore } from '@txstate-mws/svelte-store'
import { Cache, keyby, pick } from 'txstate-utils'
import { page } from '$app/stores'
import { derived } from 'svelte/store'

interface LayoutStructureNodeBase {
  routeId: string
  parent?: LayoutStructureNode | LayoutStructureNodeRoot
}

export interface LayoutStructureNode extends LayoutStructureNodeBase {
  __type?: 'node'
  cacheKey?: ($page: Page) => any
  title: string | (($page: Page) => string | Promise<string>)
  href?: string | (($page: Page) => string | Promise<string>)
  children?: LayoutStructureNode[]
}

export interface LayoutStructureNodeRoot<Next extends LayoutStructureNodeBase = LayoutStructureNodeBase> extends LayoutStructureNodeBase {
  __type?: 'root'
  cacheKey?: (params: Record<string, string>) => any
  title: string | ((params: Record<string, string>) => string | Promise<string>)
  href?: string | ((params: Record<string, string>) => string | Promise<string>)
  group?: string
  divider?: boolean
  preloadParams?: () => Promise<Record<string, string>[]>
  children?: Next[]
}

export interface LayoutStructureNodeResolved {
  title: string
  href: string
  group?: string
  divider?: boolean
}

export interface ILayoutStore {
  root: LayoutStructureNodeRoot<LayoutStructureNodeRoot<LayoutStructureNode>>
  nav?: LayoutStructureNodeResolved[]
}

function accumulateNodes (root: LayoutStructureNode | LayoutStructureNodeRoot, depth = 0) {
  const ret: (LayoutStructureNode | LayoutStructureNodeRoot)[] = []
  ret.push(root)
  for (const c of root.children ?? []) {
    c.parent = root
    const matches = c.routeId.matchAll(/\[([^\]]+)\]/g)
    const paramList = Array.from(matches).map(m => m[1])
    if (depth === 0) {
      const cn = c as LayoutStructureNodeRoot
      cn.__type = 'root'
      cn.cacheKey ??= params => pick(params, ...paramList)
      cn.href ??= params => c.routeId.replace(/\[([^\]]+)\]/g, (m, $1) => encodeURIComponent(params[$1]))
      ret.push(...accumulateNodes(cn, depth + 1))
    } else {
      const cr = c as LayoutStructureNode
      cr.__type = 'node'
      cr.cacheKey ??= $page => pick($page.params, ...paramList)
      cr.href ??= $page => c.routeId.replace(/\[([^\]]+)\]/g, (m, $1) => encodeURIComponent($page.params[$1]))
      ret.push(...accumulateNodes(cr, depth + 1))
    }
  }
  return ret
}

const titleCache = new Cache(async (cacheKey: { routeId: string, cacheKey: any }, { node, $page }: { node: LayoutStructureNode | LayoutStructureNodeRoot, $page: Page }) => {
  return node.__type === 'root'
    ? typeof node.title === 'string'
      ? node.title
      : await node.title($page.params)
    : node.__type === 'node'
      ? typeof node.title === 'string'
        ? node.title
        : await node.title($page)
      : ''
})

const hrefCache = new Cache(async (cacheKey: { routeId: string, cacheKey: any }, { node, $page }: { node: LayoutStructureNode | LayoutStructureNodeRoot, $page: Page }) => {
  return node.__type === 'root'
    ? typeof node.href === 'string'
      ? node.href
      : await node.href!($page.params)
    : node.__type === 'node'
      ? typeof node.href === 'string'
        ? node.href
        : await node.href!($page)
      : ''
})

export class LayoutStore extends Store<ILayoutStore> {
  routeById = derivedStore(this, v => keyby(accumulateNodes(v.root), 'routeId'))

  layoutInfo = derived([this.routeById, page], ([$routeById, $page]) => {
    const node = $routeById[$page.route.id!] ?? $routeById['/']
    const title = titleCache.get({ routeId: node.routeId, cacheKey: node.__type === 'root' ? node.cacheKey?.($page.params) : (node as LayoutStructureNode).cacheKey?.($page) }, { node, $page })
    const breadcrumbs: (LayoutStructureNode | LayoutStructureNodeRoot)[] = []
    for (let curr = node.parent; curr?.parent; curr = curr.parent) {
      breadcrumbs.push(curr)
    }
    breadcrumbs.reverse()
    return {
      title: title.then(title => ('group' in node && node.group ? '(' + node.group + ') ' : '') + title),
      breadcrumbs: breadcrumbs.map(bc => ({
        ...bc,
        href: hrefCache.get({ routeId: bc.routeId, cacheKey: bc.__type === 'root' ? bc.cacheKey?.($page.params) : (bc as LayoutStructureNode).cacheKey?.($page) }, { node: bc, $page }),
        title: titleCache.get({ routeId: bc.routeId, cacheKey: bc.__type === 'root' ? bc.cacheKey?.($page.params) : (bc as LayoutStructureNode).cacheKey?.($page) }, { node: bc, $page })
      }))
    }
  })

  nav = derivedStore(this, 'nav')

  constructor (initialValue: ILayoutStore) {
    super(initialValue)
    void this.generateNav()
  }

  async generateNav () {
    const nav: LayoutStructureNodeResolved[] = []
    for (const n of this.value.root.children ?? []) {
      if (n.preloadParams) {
        const paramsList = await n.preloadParams()
        const promisesLoaded = await Promise.all(paramsList.map(async params => ({ ...n, href: typeof n.href === 'string' ? n.href : await n.href!(params), title: typeof n.title === 'string' ? n.title : await n.title(params) })))
        nav.push(...promisesLoaded)
      } else nav.push(n as LayoutStructureNodeResolved)
    }
    this.update(v => ({ ...v, nav }))
  }
}
