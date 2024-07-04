<script lang="ts">
  import { eq } from '@txstate-mws/svelte-components'
  import { Store } from '@txstate-mws/svelte-store'
  import { Tab, TabContent, Tabs } from 'carbon-components-svelte'
  import { randomid } from 'txstate-utils'
  import { type ActionItem } from './util.js'
  import ActionSet from './ActionSet.svelte'
  import BadgeNumber from './BadgeNumber.svelte'

  export let title: string
  export let actions: ActionItem[] = []
  export let noPrimaryAction = false
  export let tabs: { label?: string, value: string, disabled?: boolean, badge?: number }[] = []
  export let tabsContainer = false
  export let selectedTab: number | undefined = tabs.length > 1 ? 0 : undefined
  export let headerLevel = 2

  const store = new Store({ width: 1000 })
  $: maxButtons = Math.ceil($store.width / 400.0)
  $: headerTag = 'h' + headerLevel

  const titleId = randomid()
</script>

<section use:eq={{ store }} class="panel shadow [ mx-auto ]" aria-labelledby={titleId}>
  <header class="panel-header [ flex justify-between gap-[2px] ]">
    <div class="panel-header-left [ flex-grow bg-neutral-700 flex gap-4 items-center px-[16px] py-[8px] text-base ] ">
      <svelte:element this={headerTag} id={titleId} class="panel-title [ text-white font-bold ]">
        {title}
      </svelte:element>
    </div>

    <ActionSet includeLabels large {actions} {noPrimaryAction} describedById={titleId} {maxButtons} />
  </header>
  {#if tabs.length > 1}
    <Tabs bind:selected={selectedTab} type={tabsContainer ? 'container' : undefined} autoWidth class="panel-tabs">
      {#each tabs as tab (tab.value)}
        <Tab disabled={tab.disabled} label={tab.label ?? tab.value}>{tab.label ?? tab.value}<BadgeNumber value={tab.badge} /></Tab>
      {/each}
      <svelte:fragment slot="content">
        {#each tabs as tab, i (tab.value)}
          <TabContent class="flow p-[16px]">
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
    padding-inline: 16px;
    background: #f4f4f4;
    --badge-bg: rgb(64, 64, 64);
    --badge-text: white;
  }
  .panel :global(.bx--pagination) {
    margin: -16px 0 0 -16px;
    width: calc(100% + 32px);
  }
  .panel-content {
    padding: 16px;
  }
</style>
