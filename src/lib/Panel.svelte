<script lang="ts">
  import { Button, Tab, TabContent, Tabs } from 'carbon-components-svelte'
  import { type SvelteComponent } from 'svelte'
  import { randomid } from 'txstate-utils'
  import { BadgeNumber } from './index.js'

  export let title: string
  export let actions: { label: string, icon?: typeof SvelteComponent<any> }[] = []
  export let countDisplayed: number | undefined = undefined
  export let countAll: number | undefined = undefined
  export let tabs: { label?: string, value: string, disabled?: boolean, badge?: number }[] = []
  export let tabsContainer = false
  export let selectedTab: number | undefined = tabs.length > 1 ? 0 : undefined

  $: reverseActions = actions.slice().reverse()

  const titleId = randomid()
</script>

<section class="panel shadow [ mx-auto ]" aria-labelledby={titleId}>
  <header class="panel-header [ flex justify-between gap-0.5 ]">
    <div class="panel-header-left [ flex-grow bg-neutral-700 flex gap-4 items-center px-4 py-2 text-base ] ">
      <span id={titleId} class="panel-title [ text-white font-bold ]">
        {title}
      </span>
      {#if countDisplayed}<span class="panel-count [ text-white font-normal pl-2 ]">Viewing {countDisplayed}{#if countAll} of {countAll}{/if}</span>{/if}
    </div>

    {#each reverseActions as action, i (action.label)}
      <Button type="button" icon={action.icon} kind={i !== reverseActions.length - 1 ? 'secondary' : 'primary'} on:click>{action.label}</Button>
    {/each}
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
    <div class="panel-content flow p-4">
      <slot tab={undefined} />
    </div>
  {/if}
</section>

<style>
  .panel {
    width: min(calc(100dvw - 16px), 1200px);
  }
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
</style>
