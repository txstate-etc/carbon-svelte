<script lang="ts">
  import { eq } from '@txstate-mws/svelte-components'
  import { Store } from '@txstate-mws/svelte-store'
  import { Tab, TabContent, Tabs } from 'carbon-components-svelte'
  import { randomid } from 'txstate-utils'
  import { ActionSet, BadgeNumber, type ActionItem } from './index.js'

  export let title: string
  export let actions: ActionItem[] = []
  export let noPrimaryAction = false
  export let countDisplayed: number | undefined = undefined
  export let countAll: number | undefined = undefined
  export let tabs: { label?: string, value: string, disabled?: boolean, badge?: number }[] = []
  export let tabsContainer = false
  export let selectedTab: number | undefined = tabs.length > 1 ? 0 : undefined

  const store = new Store({ width: 1000 })
  $: maxButtons = Math.ceil($store.width / 400.0)

  const titleId = randomid()
</script>

<section use:eq={{ store }} class="panel shadow [ mx-auto ]" aria-labelledby={titleId}>
  <header class="panel-header [ flex justify-between gap-0.5 ]">
    <div class="panel-header-left [ flex-grow bg-neutral-700 flex gap-4 items-center px-4 py-2 text-base ] ">
      <span id={titleId} class="panel-title [ text-white font-bold ]">
        {title}
      </span>
      {#if countDisplayed}<span class="panel-count [ text-white font-normal pl-2 ]">Viewing {countDisplayed}{#if countAll} of {countAll}{/if}</span>{/if}
    </div>

    <ActionSet includeLabels large {actions} {noPrimaryAction} describedById={titleId} {maxButtons} />
  </header>
  {#if tabs.length > 1}
    <Tabs bind:selected={selectedTab} type={tabsContainer ? 'container' : undefined} autoWidth class="panel-tabs">
      {#each tabs as tab (tab.value)}
        <Tab disabled={tab.disabled}>{tab.label ?? tab.value}<BadgeNumber value={tab.badge} /></Tab>
      {/each}
      <svelte:fragment slot="content">
        {#each tabs as tab, i (tab.value)}
          <TabContent class="flow">
            <slot tab={i} />
          </TabContent>
        {/each}
      </svelte:fragment>
    </Tabs>
  {:else}
    <div class="panel-content flow">
      <slot tab={undefined} />
    </div>
  {/if}
</section>

<style>
  .panel :global(.bx--tabs) {
    min-height: 3rem;
    padding-inline: var(--space-xs, 1rem);
    background: #f4f4f4;
    --badge-bg: rgb(64, 64, 64);
    --badge-text: white;
  }
  .panel :global(.bx--pagination) {
    margin: -1rem 0 0 -1rem;
    width: calc(100% + 2rem);
  }
  .panel-content {
    padding: 16px;
  }
</style>
