<script lang="ts">
  import { modifierKey } from '@txstate-mws/svelte-components'
  import { createEventDispatcher } from 'svelte'
  import type { TabItem } from './index.js'

  export let tabs: TabItem[] = []
  export let selectedIndex = 0
  export let value: any = undefined

  $: resolvedIndex = selectedIndex < 0 ? 0 : selectedIndex >= tabs.length ? tabs.length - 1 : selectedIndex

  const tabelements: HTMLElement[] = []
  const dispatch = createEventDispatcher()

  function activate (idx: number) {
    if (idx < 0) idx = 0
    if (idx >= tabs.length) idx = tabs.length - 1
    if (tabs[idx].disabled) idx = 0
    if (selectedIndex !== idx) {
      selectedIndex = idx
      value = tabs[selectedIndex].value
      dispatch('change', { value, idx })
      tabelements[selectedIndex].focus()
    }
  }

  function onTabClick (tab: TabItem, idx: number) {
    return (e: MouseEvent) => {
      activate(idx)
    }
  }

  function onTabKeyDown (tab: TabItem, idx: number) {
    return (e: KeyboardEvent) => {
      if (modifierKey(e)) return
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        e.stopPropagation()
        activate(resolvedIndex - 1)
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        e.stopPropagation()
        activate(resolvedIndex + 1)
      }
    }
  }
</script>

{#if tabs.length}
  <div role="radiogroup" class="[ w-full ]" class:bx--tabs={true}><div class:bx--tabs__nav={true}>
    {#each tabs as tab, i}
      {@const selected = i === resolvedIndex}
      <div
        class:bx--tabs__nav-item={true}
        class:bx--tabs__nav-item--disabled={tab.disabled}
        class:bx--tabs__nav-item--selected={selected}
      >
        <a
          href="/"
          bind:this={tabelements[i]}
          role="radio"
          tabindex={selected ? 0 : -1}
          aria-checked={selected}
          aria-disabled={tab.disabled}
          class:bx--tabs__nav-link={true}
          on:click|preventDefault={onTabClick(tab, i)}
          on:keydown={onTabKeyDown(tab, i)}
        >
          <slot>{tab.label}</slot>
        </a>
      </div>
    {/each}
  </div></div>
{/if}
