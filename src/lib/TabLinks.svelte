<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/stores'
  import type { TabLinkItem } from './index.js'

  export let tabs: TabLinkItem[] = []
</script>

{#if tabs.length}
  <div role="navigation" class="[ w-full ]" class:bx--tabs={true}><div class:bx--tabs__nav={true}>
    {#each tabs as tab, i}
      {@const selected = browser && tab.href === $page.url.pathname}
      <div
        class:bx--tabs__nav-item={true}
        class:bx--tabs__nav-item--disabled={tab.disabled}
        class:bx--tabs__nav-item--selected={selected}
      >
        <a
          href={tab.href}
          aria-disabled={tab.disabled}
          class:bx--tabs__nav-link={true}
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
</style>
