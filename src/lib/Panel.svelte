<script lang="ts">
  import { eq } from '@txstate-mws/svelte-components'
  import { Store } from '@txstate-mws/svelte-store'
  import { Tab, TabContent, Tabs } from 'carbon-components-svelte'
  import { ChevronDown, ChevronUp } from 'carbon-icons-svelte'
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
  export let indentLevel = 0
  export let expandable = false
  export let expanded = !expandable

  const store = new Store({ width: 1000 })
  $: maxButtons = Math.ceil($store.width / 400.0)
  $: headerTag = 'h' + headerLevel
  $: indentWidth = $store.width >= 800 ? 20 : 15

  const titleId = randomid()

  function onClick (e: MouseEvent) {
    if (!expandable) return
    expanded = !expanded
  }
</script>

<section use:eq={{ store }} class="panel [ mx-auto ]" aria-labelledby={titleId} class:mb-4={expanded} class:expanded style:padding-left="{indentLevel * indentWidth}px">
  <header class="panel-header [ flex justify-between gap-[2px] border-neutral-300 border-solid ]" class:border-y={!expanded}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="panel-header-left [ flex-grow flex gap-4 items-center px-[16px] py-[8px] text-base cursor-pointer ]"
      class:bg-neutral-700={expanded && headerLevel === 2} class:bg-neutral-600={expanded && headerLevel === 3}
      class:bg-neutral-500={expanded && headerLevel >= 4}
      class:text-sm={headerLevel > 2} class:text-white={expanded}
      on:click={onClick}
    >
      {#if expandable}<button type="button" aria-expanded={expanded} aria-controls="{titleId}-content">{#if expanded}<ChevronUp />{:else}<ChevronDown />{/if}</button>{/if}
      <svelte:element this={headerTag} id={titleId} class="panel-title" class:font-bold={expanded} class:font-medium={!expanded}>
        {title}
      </svelte:element>
    </div>

    <ActionSet includeLabels {actions} {noPrimaryAction} describedById={titleId} {maxButtons} forceOverflow={!expanded} />
  </header>
  {#if expanded}
    {#if tabs.length > 1}
      <Tabs bind:selected={selectedTab} type={tabsContainer ? 'container' : undefined} autoWidth class="panel-tabs">
        {#each tabs as tab (tab.value)}
          <Tab disabled={tab.disabled} label="{tab.label ?? tab.value} {tab.badge ? ` (${tab.badge})` : ''}">{tab.label ?? tab.value}<BadgeNumber value={tab.badge} /></Tab>
        {/each}
        <svelte:fragment slot="content">
          {#each tabs as tab, i (tab.value)}
            <TabContent class="flow [ p-[16px] min-h-24 ]">
              <slot tab={i} />
            </TabContent>
          {/each}
        </svelte:fragment>
      </Tabs>
    {:else}
      <div class="panel-content flow shadow [ min-h-24 ]" id="{titleId}-content">
        <slot tab={undefined} />
      </div>
    {/if}
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
  .panel:not(.expanded) :global(+ .panel header) {
    border-top-width: 0;
  }
  .panel-content {
    padding: 16px;
  }
</style>
