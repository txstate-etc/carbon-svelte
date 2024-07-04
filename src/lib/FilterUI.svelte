<script lang="ts">
  import { ResizeStore, resize } from '@txstate-mws/svelte-components'
  import type { FormStore } from '@txstate-mws/svelte-forms'
  import { Button, Search } from 'carbon-components-svelte'
  import { Filter } from 'carbon-icons-svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import { equal, findIndex } from 'txstate-utils'
  import { browser } from '$app/environment'
  import { replaceState } from '$app/navigation'
  import { page } from '$app/stores'
  import { addFilters, extractFilters, type TabRadioItem } from './util.js'
  import Form from './form/Form.svelte'
  import PanelFormDialog from './form/PanelFormDialog.svelte'
  import TabRadio from './TabRadio.svelte'
  type T = $$Generic<Record<string, any>>
  type Q = $$Generic<Record<string, any>>

  export let search = false
  export let searchDebounceMs = 500
  export let quickFilterWidth = 800
  /**
   * Set this true if you always expect filtering to be fast. It will send the 'apply' event
   * every time the user interacts with the filters, instead of waiting for them to hit an Apply
   * button.
   */
  export let noApply = false
  /**
   * Default behavior is to save the state of the applied filters in the address bar so that
   * the page can be bookmarked. Set this true if you don't want this behavior, e.g. you have
   * two FilterUI instances on the screen at once.
   */
  export let skipUrlState = false
  export let tabs: TabRadioItem[] = []

  const dispatch = createEventDispatcher()

  let dialogOpen = false
  function showDialog () {
    dialogOpen = true
  }
  function cancelDialog () {
    dialogOpen = false
  }

  const resizeStore = new ResizeStore()
  $: hideQuickFilters = ($resizeStore.clientWidth ?? 1024) <= quickFilterWidth

  let dialogStore: FormStore<T>
  let quickStore: FormStore<Q>
  let dialogData: T
  let quickData: Q
  let tabIndex = 0
  let tabData: any
  let searchStr: string | undefined

  function updateFilters () {
    if (!browser) return
    const merged = { t: tabData, f: dialogData, q: quickData, search: searchStr }
    if (!skipUrlState) {
      if ($page?.url) {
        const url = addFilters($page.url, merged)
        replaceState(url, $page.state)
      }
    }
    dispatch('apply', { ...merged.t, ...merged.f, ...merged.q, search: merged.search })
  }
  async function onQuickValidate (data: Q) {
    quickData = data
    updateFilters()
    return []
  }
  async function onDialogSubmit (data: T) {
    dialogData = data
    updateFilters()
    dialogOpen = false
    return {
      success: true,
      messages: [],
      data
    }
  }
  async function onDialogValidate (data: T) {
    if (noApply) {
      dialogData = data
      updateFilters()
    }
    return []
  }

  function onTabChange (e: CustomEvent<any>) {
    tabData = e.detail.value
    updateFilters()
  }

  let searchTimer = 0
  function onSearchInput (e: Event) {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      searchStr = (e.target as HTMLInputElement).value
      updateFilters()
    }, searchDebounceMs)
  }

  onMount(() => {
    if (browser && !skipUrlState) {
      const params = extractFilters($page.url)
      dialogData = params.f
      quickData = params.q
      tabIndex = findIndex(tabs, t => equal(t.value, params.t)) ?? 0
      tabData = tabs[tabIndex].value
      searchStr = params.search
      void quickStore?.setData(quickData)
      dispatch('mount', { ...tabData, ...dialogData, ...quickData, search: searchStr })
    }
  })
</script>

<div use:resize={{ store: resizeStore }} class="filter-ui-container [ flex flex-wrap items-end gap-2 mb-4 ]">
  {#if tabs.length}
    <TabRadio selectedIndex={tabIndex} on:change={onTabChange} {tabs} />
  {/if}
  {#if search}
    <div class="filter-ui-search-container">
      <Search on:input={onSearchInput} value={searchStr} size="lg" />
    </div>
  {/if}
  {#if $$slots.quickfilters && !hideQuickFilters}
    <Form bind:store={quickStore} validate={onQuickValidate} submit={async data => ({ success: true, messages: [], data })} class="[ flex ]">
      <slot name="quickfilters" />
      <svelte:fragment slot="submit">&nbsp;</svelte:fragment>
    </Form>
  {/if}
  {#if $$slots.default}
    <Button kind="primary" size="field" icon={Filter} on:click={showDialog}>{$$slots.quickfilters && !hideQuickFilters ? 'More' : 'Show'} Filters</Button>
    <PanelFormDialog bind:open={dialogOpen} preload={dialogData} title="{noApply ? 'Choose' : 'Apply'} Filters" bind:store={dialogStore} submit={onDialogSubmit} validate={onDialogValidate} on:cancel={cancelDialog} cancelText={noApply ? '' : 'Cancel'} submitText={noApply ? '' : 'Apply'}>
      <svelte:fragment slot="beforeform">
        {#if hideQuickFilters}
          <Form bind:store={quickStore} validate={onQuickValidate} submit={async data => ({ success: true, messages: [], data })}>
            <slot name="quickfilters" />
            <svelte:fragment slot="submit">&nbsp;</svelte:fragment>
          </Form>
        {/if}
      </svelte:fragment>
      <slot />
    </PanelFormDialog>
  {/if}
</div>
