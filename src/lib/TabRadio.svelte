<script lang="ts">
  import { modifierKey } from '@txstate-mws/svelte-components'
  import { createEventDispatcher } from 'svelte'
  import type { TabRadioItem } from './index.js'

  export let tabs: TabRadioItem[] = []
  export let selectedIndex = 0
  export let value: any = undefined

  $: resolvedIndex = selectedIndex < 0 ? 0 : selectedIndex >= tabs.length ? tabs.length - 1 : selectedIndex

  const tabelements: HTMLElement[] = []
  const dispatch = createEventDispatcher()

  function activate (idx: number, direction?: 'left' | 'right') {
    if (idx < 0) idx = 0
    if (idx >= tabs.length) idx = tabs.length - 1
    if (tabs[idx].disabled) {
      if (direction == null) return
      while (tabs[idx]?.disabled) idx += (direction === 'left' ? -1 : 1)
      if (idx >= tabs.length || idx < 0) return
    }
    if (selectedIndex !== idx) {
      selectedIndex = idx
      tabelements[selectedIndex].focus()
      if (!tabs[idx].disabled) {
        value = tabs[selectedIndex].value
        dispatch('change', { value, idx })
      }
    }
  }

  function onTabClick (tab: TabRadioItem, idx: number) {
    return (e: MouseEvent) => {
      activate(idx)
    }
  }

  function onTabKeyDown (tab: TabRadioItem, idx: number) {
    return (e: KeyboardEvent) => {
      if (modifierKey(e)) return
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        e.stopPropagation()
        activate(resolvedIndex - 1, 'left')
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        e.stopPropagation()
        activate(resolvedIndex + 1, 'right')
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
          {#if tab.icon}
            <span class="icon">
              <svelte:component this={tab.icon} />
            </span>
          {/if}
          {tab.label}
        </a>
      </div>
    {/each}
  </div></div>
{/if}

<style>
  .icon {
    display: inline-block;
    margin-right: 8px;
    vertical-align: text-bottom;
  }
  @media (max-width: 42rem) {
    .bx--tabs__nav {
      position: relative !important;
      z-index: unset !important;
    }
    .bx--tabs {
      padding-bottom: 8px;
    }
    div.bx--tabs__nav-item--selected {
      display: block;
      background-color: var(--cds-hover-ui, #e5e5e5);
      border-bottom: 2px solid var(--cds-interactive-04, #0f62fe);
    }
    div.bx--tabs__nav-item--selected a {
      font-weight: bold;
      border: 0;
    }
  }
</style>
