<script lang="ts">
  import { eq, modifierKey } from '@txstate-mws/svelte-components'
  import { Store } from '@txstate-mws/svelte-store'
  import { Button } from 'carbon-components-svelte'
  import { ChevronRight } from 'carbon-icons-svelte'
  import { afterUpdate } from 'svelte'
  import { randomid } from 'txstate-utils'
  import { type ActionItem, type NavigationItem, type TagItem } from './util.js'
  import ActionSet from './ActionSet.svelte'
  import TagSet from './TagSet.svelte'

  export let title: string
  export let subhead: string | undefined = undefined
  export let emphasizeTitle = false
  export let actions: ActionItem[] = []
  export let noPrimaryAction = false
  export let forceOverflow = false
  export let tags: TagItem[] = []
  export let tagsInBody = false
  export let navigations: NavigationItem[] = []
  export let noPrimaryNavigation = false

  const store = new Store({ width: 500 })

  $: navToActions = $store.width >= 800
  $: resolvedActions = navToActions ? actions.concat(navigations as ActionItem[]) : actions
  $: maxButtons = Math.min(3, Math.ceil($store.width / 400.0))
  $: {
    let idx = 0
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].onClick) (tags[i] as any).idx = idx++
    }
  }

  let activeNav = 0
  const navelements: (HTMLButtonElement | HTMLAnchorElement)[] = []

  function navActivate (idx: number) {
    activeNav = idx
    navelements[idx].focus()
  }

  function navUp () {
    const nextIdx = activeNav - 1
    if (nextIdx >= 0 && nextIdx !== activeNav) navActivate(nextIdx)
  }

  function navDown () {
    const nextIdx = activeNav + 1
    if (nextIdx < navigations.length && nextIdx !== activeNav) navActivate(nextIdx)
  }

  function navClick (nav: NavigationItem) {
    return (e: MouseEvent) => {
      if (nav.disabled) e.preventDefault()
    }
  }

  function navKeyDown (e: KeyboardEvent) {
    if (modifierKey(e)) return
    if (e.key.startsWith('Arrow')) {
      e.stopPropagation()
      e.preventDefault()
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') navUp()
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') navDown()
  }

  afterUpdate(() => {
    for (const btn of navelements) {
      btn?.removeEventListener('keydown', navKeyDown as any)
      btn?.addEventListener('keydown', navKeyDown as any)
    }
  })

  const titleId = randomid()
</script>

<div role="listitem" use:eq={{ store }} class="card shadow [ flex flex-col ]" aria-labelledby={titleId}>
  <header class="card-header [ flex items-start justify-between p-[8px] ]">
    <div class="card-header-left [ flex-grow flex-shrink ]">
      <div id={titleId} class="card-title [ text-lg font-bold ]" class:emphasizeTitle>{title}</div>
      {#if subhead}<div class="card-subhead">{subhead}</div>{/if}
    </div>
    <ActionSet actions={resolvedActions} {noPrimaryAction} {maxButtons} {forceOverflow} describedById={titleId} />
  </header>
  {#if tags.length}
    <TagSet {tags} class="{tagsInBody ? '' : 'hasbg'}" />
  {/if}
  <div class="card-content [ p-[8px] flex-grow ]">
    <slot />
  </div>
  {#if !navToActions}
    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
    <div class="card-footer [ flex flex-wrap flex-row-reverse ]" class:singular={navigations.length === 1} role="menubar">
      {#each navigations as nav, i}
        <Button bind:ref={navelements[i]} href={nav.href} size="field"
          role="menuitem" aria-disabled={nav.disabled} aria-describedby={titleId}
          tabindex={i === activeNav ? '0' : '-1'}
          icon={nav.icon ?? ChevronRight} kind={noPrimaryNavigation || i > 0 ? 'secondary' : 'primary'}
          class="navigation [ w-full ] {nav.disabled ? 'bx--btn--disabled' : ''}"
          on:click={navClick(nav)}
        >{nav.label}</Button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .card {
    border: 2px solid #e7e5e4;
  }
  .card-header {
    background-color: #e7e5e4;
  }
  .card-title {
    margin-block-start: 0;
    width: fit-content;
  }
  .card-title.emphasizeTitle {
    background-color: #D8D0CF;
    padding: 0 8px;
  }
  .card :global(.tag-set) {
    padding: 8px;
  }
  .card :global(.tag-set > *) {
    max-width: calc(50% - 2px);
  }
  .card :global(.tag-set.hasbg) {
    padding-top:0;
    background-color: #e7e5e4;
  }

  .card .card-footer > :global(*) {
    max-width: 100%;
    width: calc(50%);
  }
  .card .card-footer.singular > :global(*) {
    width: 100%;
  }
  .card:global([data-eq~="300px"]) .card-footer > :global(*) {
    width: 100%;
  }
</style>
