<script lang="ts">
  import { browser } from '$app/environment'
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import { type LayoutStructureNode, type LayoutStructureNodeRoot, LayoutStore } from '$lib/stores/index.js'
  import { modifierKey } from '@txstate-mws/svelte-components'
  import { Breadcrumb, BreadcrumbItem, HeaderAction, HeaderPanelDivider, HeaderPanelLink, HeaderPanelLinks, HeaderUtilities, SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem, SkipToContent } from 'carbon-components-svelte'
  import { Close, Menu, UserAvatar } from 'carbon-icons-svelte'
  import { tick } from 'svelte'
  import { writable } from 'svelte/store'
  import { groupby, isBlank, isNotBlank, mapgroupby } from 'txstate-utils'
  import LayoutBase from './LayoutBase.svelte'
  import { type ShellItem } from './util.js'

  export let companyName = 'TXST'
  export let appName: string
  export let navRoot: LayoutStructureNodeRoot<LayoutStructureNodeRoot<LayoutStructureNode>>
  export let profilelinks: ShellItem[] = []
  export let stickyHeader = true
  export let profileMenuDescription = 'Open User Menu'
  export let overlayText: string | undefined = undefined
  export let reverseWeights: boolean = false

  const layoutStore = new LayoutStore({ root: navRoot })
  const nav = layoutStore.nav
  const layoutInfo = browser ? layoutStore.layoutInfo(page) : writable({ title: '', breadcrumbs: [] })
  let isOpen = false
  const sidenavelements: HTMLAnchorElement[] = []
  let sidenavcontainer: HTMLElement | undefined
  let hamburgerelement: HTMLElement | undefined

  function closeNav () {
    isOpen = false
    hamburgerelement?.focus()
  }
  function hamburgerClick () {
    if (isOpen) closeNav()
    else {
      isOpen = true
      void tick().then(() => { sidenavelements[0]?.focus() })
    }
  }
  function onSideNavKeydown (e: KeyboardEvent) {
    if (!modifierKey(e) && e.key === 'Escape') {
      e.stopPropagation()
      e.preventDefault()
      closeNav()
    }
  }
  function bodyClick (e: MouseEvent) {
    if (sidenavcontainer?.contains(e.target as HTMLElement)) return
    if (hamburgerelement?.contains(e.target as HTMLElement)) return
    if (!document.body.contains(e.target as HTMLElement)) return
    isOpen = false
  }

  $: navGroups = mapgroupby($nav?.filter(c => isNotBlank(c.group)), 'group')
  $: groupedlinks = groupby(profilelinks, l => l.group ?? 'undefined')
  $: groupedlinkentries = Object.entries(groupedlinks)
</script>
<svelte:head>
  {#await $layoutInfo.title then layoutTitle}
    <title>{layoutTitle ? `${layoutTitle} : ${appName}` : appName}</title>
  {/await}
</svelte:head>
<svelte:body on:click={bodyClick} />
<LayoutBase>
  <SkipToContent id="skip" />
  <header class:bx--header={true} class:fixed={stickyHeader} class:relative={!stickyHeader} class="[ flex-wrap ]">
    {#if overlayText}
      <div class="overlayTextContainer">
        <svg width="10000" height="3rem" role="img" aria-hidden="true">
          {#each Array(100) as _, i}
            {@const offset = i * 65}
            <text x="{offset}" y="33" class="overlayText" fill="#723F3B" font-size="20" font-weight="bold" text-anchor="middle" transform="rotate(30, {offset}, 0)">{overlayText}</text>
          {/each}
        </svg>
      </div>
    {/if}
    <button
      type="button"
      aria-label="Hamburger Menu"
      class:bx--header__action={true} class:bx--header__menu-trigger={true} class:bx--header__menu-toggle={true}
      bind:this={hamburgerelement}
      on:click={hamburgerClick}
    >
      <svelte:component this={isOpen ? Close : Menu} size={20} />
    </button>
    <a href="{base}/" class:bx--header__name={true}>
      {#if companyName}
        <span class:bx--header__name--prefix={true} class:companyname-reverseweight={reverseWeights}>{companyName}&nbsp;</span>
      {/if}
      <span class:appname-reverseweight={reverseWeights}>{appName}</span>
    </a>
    {#if profilelinks.length}
      <HeaderUtilities>
        <HeaderAction icon={UserAvatar} text={profileMenuDescription}>
          <HeaderPanelLinks>
            {#each groupedlinkentries as [group, navs]}
              {#if isNotBlank(group) && group !== 'undefined'}<HeaderPanelDivider>{group}</HeaderPanelDivider>{/if}
              {#each navs as nav}
                <HeaderPanelLink
                  aria-disabled={nav.disabled}
                  href={nav.href}
                  on:click={nav.onClick}
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
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div style:display={isOpen ? 'block' : 'none'} bind:this={sidenavcontainer} on:keydown={onSideNavKeydown}>
    <SideNav {isOpen} class={!isOpen ? 'sideNavHidden' : ''}>
      <SideNavItems>
        {#each ($nav ?? []).filter(n => n.group == null) as pg, i}
          {#await pg.title then title}
            {#await pg.href then href}
              {#if isBlank(pg.group)}<SideNavLink text={title} icon={pg.icon ?? undefined} href="{base}{href}" on:click={() => { isOpen = false }} bind:ref={sidenavelements[i]} />{/if}
            {/await}
          {/await}
        {/each}
        {#each navGroups.entries() as [name, pgs] (name)}
          <SideNavMenu icon={pgs.find(pg => pg.icon)?.icon ?? undefined} text={name} expanded={true}>
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

  header.fixed~.bx--content {
    margin-top: var(--nav-height-offset, 7rem);
  }

  :global(html:has(header.fixed)) {
    scroll-padding-top:var(--nav-height-offset, 7rem);
  }

  main.bx--content {
    margin-left: auto;
    margin-right: auto;
    max-width: 1400px;
    padding: 16px 0;
  }

  :global(.bx--header-panel) {
    background-color: #fff;
  }

 :global(.bx--switcher__item-link),
 :global(.bx--header-panel-divider) {
    color: #525252!important;
    font-size: var(--cds-productive-heading-01-font-size, 0.875rem)!important;
    font-weight: var(--cds-productive-heading-01-font-weight, 600)!important;
    line-height: var(--cds-productive-heading-01-line-height, 1.28572)!important;
    letter-spacing: var(--cds-productive-heading-01-letter-spacing, 0.16px)!important;
  }
  :global(.bx--header__action-text) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .overlayTextContainer {
    position: absolute;
    z-index: -1;
  }
  .companyname-reverseweight {
    font-weight: bold;
  }
  .appname-reverseweight {
    font-weight: normal;
  }
</style>
