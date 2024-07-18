<script lang="ts">
  import { modifierKey } from '@txstate-mws/svelte-components'
  import { Tag } from 'carbon-components-svelte'
  import { afterUpdate } from 'svelte'
  import type { TagItem } from './util.js'

  export let tags: TagItem[] | undefined
  export let describedById: string | undefined = undefined
  export let small = false

  interface TagItemWithIdx extends TagItem {
    idx?: number
  }
  $: dTags = tags ?? []
  $: tagsWithIdx = dTags as TagItemWithIdx[]
  $: {
    let idx = 0
    for (let i = 0; i < dTags.length; i++) {
      if (dTags[i].onClick) (dTags[i] as any).idx = idx++
    }
  }

  let activeTag = 0
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
  })
</script>
{#if dTags?.length}
  <div bind:this={tagcontainer} class="tag-set {$$restProps.class ?? ''}" class:small role="list" aria-label="tags">
    {#each tagsWithIdx as tag}
      <Tag type={tag.type === 'yellow' ? 'cyan' : tag.type ?? 'cyan'} icon={tag.icon} interactive={tag.onClick != null} size={small ? 'sm' : undefined}
        tabindex={tag.idx === activeTag ? 0 : -1} on:click={tagClick(tag)}
        role="listitem" aria-describedby={describedById} class={tag.type === 'yellow' ? 'bg-tagyellow-200 border-tagyellow-900 text-tagyellow-900' : undefined}
      >{tag.label}</Tag>
    {/each}
  </div>
{/if}

<style>
  .tag-set {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 4px;
    align-items: flex-start;
  }
  .tag-set.small {
    gap: 2px 4px;
  }
  .tag-set :global(.bx--tag) {
    margin: 0;
  }
</style>
