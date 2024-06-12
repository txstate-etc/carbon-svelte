<script lang="ts">
  import { eq, modifierKey } from '@txstate-mws/svelte-components'
  import { Store } from '@txstate-mws/svelte-store'
  import { Button, Tag } from 'carbon-components-svelte'
  import { ChevronRight } from 'carbon-icons-svelte'
  import { afterUpdate } from 'svelte'
  import { randomid } from 'txstate-utils'
  import { ActionSet, type ActionItem, type NavigationItem, type TagItem } from './index.js'

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

  interface TagItemWithIdx extends TagItem {
    idx?: number
  }

  $: navToActions = $store.width >= 800
  $: resolvedActions = navToActions ? actions.concat(navigations as ActionItem[]) : actions
  $: maxButtons = Math.min(3, Math.ceil($store.width / 400.0))
  $: tagsWithIdx = tags as TagItemWithIdx[]
  $: {
    let idx = 0
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].onClick) (tags[i] as any).idx = idx++
    }
  }

  let activeNav = 0
  const navelements: (HTMLButtonElement | HTMLAnchorElement)[] = []
  let activeTag = 0

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

  let tagcontainer: HTMLDivElement
  let tagelements: HTMLElement[] = []
  function tagActivate (idx: number) {
    activeTag = idx
    tagelements[idx].focus()
  }

  function tagUp () {
    const nextIdx = activeTag - 1
    if (nextIdx >= 0 && nextIdx !== activeTag) tagActivate(nextIdx)
  }

  function tagDown () {
    const nextIdx = activeTag + 1
    if (nextIdx < tagelements.length && nextIdx !== activeTag) tagActivate(nextIdx)
  }

  function tagClick (tag: TagItem) {
    return (e: MouseEvent) => {
      e.preventDefault()
      tag.onClick?.()
    }
  }

  function tagKeyDown (e: KeyboardEvent) {
    if (modifierKey(e)) return
    if (e.key.startsWith('Arrow')) {
      e.stopPropagation()
      e.preventDefault()
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') tagUp()
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') tagDown()
  }

  afterUpdate(() => {
    tagelements = Array.from(tagcontainer?.querySelectorAll('.bx--tag--interactive') ?? [])
    for (const tag of tagelements) {
      tag?.removeEventListener('keydown', tagKeyDown)
      tag?.addEventListener('keydown', tagKeyDown)
    }
    for (const btn of navelements) {
      btn?.removeEventListener('keydown', navKeyDown as any)
      btn?.addEventListener('keydown', navKeyDown as any)
    }
  })

  const titleId = randomid()
</script>

<article role="listitem" use:eq={{ store }} class="card shadow [ flex flex-col ]" aria-labelledby={titleId}>
  <header class="card-header [ flex items-start justify-between p-[8px] ]">
    <div class="card-header-left [ flex-grow flex-shrink ]">
      <div id={titleId} class="card-title [ text-lg font-bold ]" class:emphasizeTitle>{title}</div>
      {#if subhead}<div class="card-subhead">{subhead}</div>{/if}
    </div>
    <ActionSet actions={resolvedActions} {noPrimaryAction} {maxButtons} {forceOverflow} describedById={titleId} />
  </header>
  {#if tags.length}
    <div bind:this={tagcontainer} class="card-tags" class:hasbg={!tagsInBody} role="list" aria-label="tags">
      {#each tagsWithIdx as tag}
        <Tag type={tag.type ?? 'cyan'} icon={tag.icon} interactive={tag.onClick != null}
          tabindex={tag.idx === activeTag ? 0 : -1} on:click={tagClick(tag)}
          role="listitem" aria-describedby={titleId}
        >{tag.label}</Tag>
      {/each}
    </div>
  {/if}
  <div class="card-content [ p-[8px] flex-grow ]">
    <slot />
  </div>
  {#if !navToActions}
    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
    <footer class="card-footer [ flex flex-wrap flex-row-reverse ]" class:singular={navigations.length === 1} role="menubar">
      {#each navigations as nav, i}
        <Button bind:ref={navelements[i]} href={nav.href} size="field"
          role="menuitem" aria-disabled={nav.disabled} aria-describedby={titleId}
          tabindex={i === activeNav ? '0' : '-1'}
          icon={nav.icon ?? ChevronRight} kind={noPrimaryNavigation || i > 0 ? 'secondary' : 'primary'}
          class="navigation [ w-full ] {nav.disabled ? 'bx--btn--disabled' : ''}"
          on:click={navClick(nav)}
        >{nav.label}</Button>
      {/each}
    </footer>
  {/if}
</article>

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
  .card-tags {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-top: 0;
    padding: 2px 0;
  }
  .card-tags > :global(*) {
    max-width: 50%;
  }
  .card-tags.hasbg {
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
