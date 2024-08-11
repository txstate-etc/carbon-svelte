<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/stores'
  import type { TabLinkItem } from './index.js'

  export let tabs: TabLinkItem[] = []
</script>

{#if tabs.length}
  <div {...$$restProps} role="navigation" class="[ w-full ] {$$restProps.class ?? ''}" class:bx--tabs={true}><div role="list" class:bx--tabs__nav={true}>
    {#each tabs as tab}
      {@const selected = browser && tab.href === $page.url.pathname}
      <div role="listitem"
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
  @media (max-width: 42rem) {
    .bx--tabs__nav {
      position: relative !important;
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
