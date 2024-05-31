<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, HeaderAction, HeaderPanelDivider, HeaderPanelLink, HeaderPanelLinks, HeaderUtilities, SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem, SkipToContent } from 'carbon-components-svelte'
  import { Close, Menu, UserAvatar } from 'carbon-icons-svelte'
  import { tick } from 'svelte'
  import { groupby, isBlank, isNotBlank, mapgroupby } from 'txstate-utils'
  import { base } from '$app/paths'
  import { type LayoutStructureNode, type LayoutStructureNodeRoot, LayoutBase, LayoutStore, type ShellItem } from '$lib/index.js'

  export let companyName = 'TXST'
  export let appName: string
  export let navRoot: LayoutStructureNodeRoot<LayoutStructureNodeRoot<LayoutStructureNode>>
  export let profilelinks: ShellItem[] = []

  const { layoutInfo } = new LayoutStore({ root: navRoot })
  let isOpen = false
  let rootnavelement: HTMLAnchorElement
  function hamburgerClick () {
    if (isOpen) isOpen = false
    else {
      isOpen = true
      void tick().then(() => { rootnavelement?.focus() })
    }
  }

  $: navGroups = mapgroupby(navRoot.children?.filter(c => isNotBlank(c.group)), 'group')
  $: groupedlinks = groupby(profilelinks, l => l.group ?? 'undefined')
  $: groupedlinkentries = Object.entries(groupedlinks)
</script>

<LayoutBase>
  <SkipToContent />
  <header class="bx--header [ flex-wrap ]">
    <button
      type="button"
      aria-label="Hamburger Menu"
      class="bx--header__action bx--header__menu-trigger bx--header__menu-toggle"
      on:click={hamburgerClick}
    >
      <svelte:component this={isOpen ? Close : Menu} size={20} />
    </button>
    <a href="{base}/" class="bx--header__name">
      {#if companyName}
        <span class="bx--header__name--prefix">{companyName}&nbsp;</span>
      {/if}
      {appName}
    </a>
    {#if profilelinks.length}
      <HeaderUtilities>
        <HeaderAction icon={UserAvatar}>
          <HeaderPanelLinks>
            {#each groupedlinkentries as [group, navs]}
              {#if isNotBlank(group) && group !== 'undefined'}<HeaderPanelDivider>{group}</HeaderPanelDivider>{/if}
              {#each navs as nav}
                <HeaderPanelLink
                  aria-disabled={nav.disabled}
                  href={nav.href}
                >
                  {#if nav.icon}
                    <svelte:component this={nav.icon} class="inline align-text-bottom mr-1" />
                  {/if}
                  {nav.label}
                </HeaderPanelLink>
              {/each}
            {/each}
          </HeaderPanelLinks>
        </HeaderAction>
      </HeaderUtilities>
    {/if}
    <div class="breadcrumbs [ w-full bg-stone-300 py-1 px-4 ]">
      <Breadcrumb>
        {#each $layoutInfo.breadcrumbs as bc}
          {#await bc.title then title}
            <BreadcrumbItem href={bc.href}>{title}</BreadcrumbItem>
          {/await}
        {/each}
      </Breadcrumb>
      {#await $layoutInfo.title then title}
        <h1 class="[ text-lg ]">{title}</h1>
      {/await}
    </div>
  </header>
  <div style:display={isOpen ? 'block' : 'none'}>
    <SideNav {isOpen} class={!isOpen ? 'sideNavHidden' : ''}>
      <SideNavItems>
        <SideNavLink bind:ref={rootnavelement} text={navRoot.title} href="{base}" />
        {#each navRoot.children ?? [] as pg}
          {#if isBlank(pg.group)}<SideNavLink text={pg.title} href="{base}{pg.routeId}" />{/if}
        {/each}
        {#each navGroups.entries() as [name, pgs] (name)}
          <SideNavMenu text={name} expanded={true}>
            {#each pgs as pg}
              <SideNavMenuItem text={pg.title} href="{base}{pg.routeId}" />
            {/each}
          </SideNavMenu>
        {/each}
      </SideNavItems>
    </SideNav>
  </div>
  <main id="main-content" class="bx--content">
    <slot />
  </main>
</LayoutBase>

<style>
  main.bx--content {
    margin-left: 0;
    max-width: 1400px;
  }
</style>
