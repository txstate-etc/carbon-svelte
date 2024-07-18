<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, HeaderAction, HeaderPanelDivider, HeaderPanelLink, HeaderPanelLinks, HeaderUtilities, SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem, SkipToContent } from 'carbon-components-svelte'
  import { Close, Menu, UserAvatar } from 'carbon-icons-svelte'
  import { tick } from 'svelte'
  import { writable } from 'svelte/store'
  import { groupby, isBlank, isNotBlank, mapgroupby } from 'txstate-utils'
  import { browser } from '$app/environment'
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import { type ShellItem } from './util.js'
  import { type LayoutStructureNode, type LayoutStructureNodeRoot, LayoutStore } from '$lib/stores/index.js'
  import LayoutBase from './LayoutBase.svelte'

  export let companyName = 'TXST'
  export let appName: string
  export let navRoot: LayoutStructureNodeRoot<LayoutStructureNodeRoot<LayoutStructureNode>>
  export let profilelinks: ShellItem[] = []

  const layoutStore = new LayoutStore({ root: navRoot })
  const nav = layoutStore.nav
  const layoutInfo = browser ? layoutStore.layoutInfo(page) : writable({ title: '', breadcrumbs: [] })
  let isOpen = false
  let rootnavelement: HTMLAnchorElement
  function hamburgerClick () {
    if (isOpen) isOpen = false
    else {
      isOpen = true
      void tick().then(() => { rootnavelement?.focus() })
    }
  }

  $: navGroups = mapgroupby($nav?.filter(c => isNotBlank(c.group)), 'group')
  $: groupedlinks = groupby(profilelinks, l => l.group ?? 'undefined')
  $: groupedlinkentries = Object.entries(groupedlinks)
</script>

<LayoutBase>
  <SkipToContent />
  <header class:bx--header={true} class="[ flex-wrap ]">
    <button
      type="button"
      aria-label="Hamburger Menu"
      class:bx--header__action={true} class:bx--header__menu-trigger={true} class:bx--header__menu-toggle={true}
      on:click={hamburgerClick}
    >
      <svelte:component this={isOpen ? Close : Menu} size={20} />
    </button>
    <a href="{base}/" class:bx--header__name={true}>
      {#if companyName}
        <span class:bx--header__name--prefix={true}>{companyName}&nbsp;</span>
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
                    <svelte:component this={nav.icon} class="inline align-text-bottom mr-[16px]" />
                  {/if}
                  {nav.label}
                </HeaderPanelLink>
              {/each}
            {/each}
          </HeaderPanelLinks>
        </HeaderAction>
      </HeaderUtilities>
    {/if}

    {#await $layoutInfo.title then layoutTitle}
      {#if layoutTitle}
        <div class="breadcrumbs [ w-full bg-stone-300 py-[4px] px-[16px] ]">
          <Breadcrumb>
            {#each $layoutInfo.breadcrumbs as bc}
              {#await bc.title then title}
                {#await bc.href then href}
                  <BreadcrumbItem {href}>{title}</BreadcrumbItem>
                {/await}
              {/await}
            {/each}
          </Breadcrumb>
          <h1 class="[ text-lg ]">{layoutTitle}</h1>
        </div>
      {/if}
    {/await}
  </header>
  <div style:display={isOpen ? 'block' : 'none'}>
    <SideNav {isOpen} class={!isOpen ? 'sideNavHidden' : ''}>
      <SideNavItems>
        {#each ($nav ?? []).filter(n => n.group == null) as pg}
          {#await pg.title then title}
            {#await pg.href then href}
              {#if isBlank(pg.group)}<SideNavLink text={title} href="{base}{href}" on:click={() => { isOpen = false }} />{/if}
            {/await}
          {/await}
        {/each}
        {#each navGroups.entries() as [name, pgs] (name)}
          <SideNavMenu text={name} expanded={true}>
            {#each pgs as pg}
              {#await pg.title then title}
                {#await pg.href then href}
                  <SideNavMenuItem text={title} href="{base}{href}" on:click={() => { isOpen = false }} />
                {/await}
              {/await}
            {/each}
          </SideNavMenu>
        {/each}
      </SideNavItems>
    </SideNav>
  </div>
  <main id="main-content" class:bx--content={true}>
    <slot />
  </main>
</LayoutBase>

<style>
  .bx--header {
    position: relative;
    height: auto;
  }

  main.bx--content {
    margin-left: auto;
    margin-right: auto;
    max-width: 1400px;
    margin-top: 0;
    padding: 16px 0;
  }
</style>
