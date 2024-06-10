import type { Page } from '@sveltejs/kit'
import { Store, derivedStore } from '@txstate-mws/svelte-store'
import { Cache, keyby, pick } from 'txstate-utils'
import { page } from '$app/stores'
import { derived } from 'svelte/store'

export interface LayoutStructureNode {
  parent?: LayoutStructureNode
  routeId: string
  title: string | (($page: Page) => string | Promise<string>)
  cacheKey?: ($page: Page) => any
  href?: ($page: Page) => string | Promise<string>
  group?: string
  children?: LayoutStructureNode[]
}

export interface LayoutStructureNodeRoot<Next extends LayoutStructureNode> extends LayoutStructureNode {
  title: string
  divider?: boolean
  children?: Next[]
}

export interface ILayoutStore {
  root: LayoutStructureNodeRoot<LayoutStructureNodeRoot<LayoutStructureNode>>
}

function accumulateNodes (root: LayoutStructureNode) {
  const ret: LayoutStructureNode[] = []
  ret.push(root)
  for (const c of root.children ?? []) {
    c.parent = root
    const matches = c.routeId.matchAll(/\[([^\]]+)\]/g)
    const paramList = Array.from(matches).map(m => m[1])
    c.cacheKey ??= $page => pick($page.params, ...paramList)
    c.href ??= $page => c.routeId.replace(/\[([^\]]+)\]/g, (m, $1) => $page.params[$1])
    ret.push(...accumulateNodes(c))
  }
  return ret
}

const titleCache = new Cache(async (cacheKey: { routeId: string, cacheKey: any }, { node, $page }: { node: LayoutStructureNode, $page: Page }) => {
  if (typeof node.title === 'string') return node.title
  return await node.title($page)
})

const hrefCache = new Cache(async (cacheKey: { routeId: string, cacheKey: any }, { node, $page }: { node: LayoutStructureNode, $page: Page }) => {
  if (typeof node.href === 'string') return node.href
  return await node.href!($page)
})

export class LayoutStore extends Store<ILayoutStore> {
  routeById = derivedStore(this, v => keyby(accumulateNodes(v.root), 'routeId'))

  layoutInfo = derived([this.routeById, page], ([$routeById, $page]) => {
    const node = $routeById[$page.route.id!] ?? $routeById['/']
    const title = titleCache.get({ routeId: node.routeId, cacheKey: node.cacheKey?.($page) }, { node, $page })
    const breadcrumbs: LayoutStructureNode[] = []
    for (let curr = node.parent; curr?.parent; curr = curr.parent) {
      breadcrumbs.push(curr)
    }
    breadcrumbs.reverse()
    return {
      title: title.then(title => (node.group ? '(' + node.group + ') ' : '') + title),
      breadcrumbs: breadcrumbs.map(bc => ({ ...bc, href: hrefCache.get({ routeId: bc.routeId, cacheKey: bc.cacheKey?.($page) }, { node: bc, $page }), title: titleCache.get({ routeId: bc.routeId, cacheKey: bc.cacheKey?.($page) }, { node: bc, $page }) }))
    }
  })
}
