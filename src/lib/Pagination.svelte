<script lang="ts">
  import { Pagination } from 'carbon-components-svelte'
  import { createEventDispatcher, onMount, type ComponentProps } from 'svelte'
  import { addPaginationParams, extractPaginationParams, getUrl, replaceState } from './util.js'
  import { browser } from '$app/environment'
  import { page as pageStore } from '$app/stores'

  interface $$Props extends Omit<ComponentProps<Pagination>, 'pageInputDisabled' | 'pageSizeInputDisabled' | 'itemRangeText' | 'itemText' | 'itemsPerPageText' | 'pageSizes'> {
    page?: number
    totalItems?: number
    visibleItems?: number
    pageSize?: 25 | 100 | 500
    chooseSize?: boolean
    noun?: string
    nounPlural?: string
  }

  export let page = 1
  export let totalItems: number | undefined = undefined
  /** only necessary if no totalItems is available */
  export let visibleItems: number | undefined = undefined
  export let pageSize: 25 | 100 | 500 = 100
  export let chooseSize = false
  export let noun = 'item'
  export let nounPlural = 'items'
  /**
   * Default behavior is to save the state of the applied filters in the address bar so that
   * the page can be bookmarked. Set this true if you don't want this behavior, e.g. you have
   * two FilterUI instances on the screen at once.
   */
  export let skipUrlState = false

  const dispatch = createEventDispatcher()

  const pageSizes = [25, 100, 500]
  function itemText (min: number, max: number) {
    return max - min > 0 ? `${nounPlural} ${min}-${Math.max(max, min + (visibleItems ?? max - min))}` : `${noun} ${min}`
  }
  function itemRangeText (min: number, max: number, total: number) {
    return (pageSize > total ? total + ' ' : `${min}-${max} of ${total} `) + (total !== 1 ? nounPlural : noun)
  }
  function onChange (e: CustomEvent<{ page?: number, pageSize?: number }>) {
    if (e.detail.page !== undefined) page = e.detail.page
    if (e.detail.pageSize !== undefined) pageSize = e.detail.pageSize as typeof pageSize
    if (!skipUrlState) {
      const url = addPaginationParams(getUrl(), { page, pagesize: pageSize })
      replaceState(url)
    }
    dispatch('update', { page, pageSize })
  }

  onMount(() => {
    if (browser && !skipUrlState) {
      const params = extractPaginationParams($pageStore.url)
      page = params.page ?? page
      pageSize = params.pagesize as typeof pageSize ?? pageSize
    }
    dispatch('mount', { page, pageSize })
  })
</script>

<Pagination {...$$restProps} bind:page {totalItems} itemsPerPageText="Per Page:" bind:pageSize {pageSizes} {itemText} {itemRangeText} pageSizeInputDisabled={!chooseSize || totalItems === 0} pageInputDisabled={!totalItems} on:change={onChange} />
