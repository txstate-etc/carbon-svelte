<script lang="ts">
  import { Pagination } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'

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

  const dispatch = createEventDispatcher()

  const pageSizes = [25, 100, 500]
  function itemText (min: number, max: number) {
    return max - min > 0 ? `${nounPlural} ${min}-${Math.max(max, min + (visibleItems ?? max - min))}` : `${noun} ${min}`
  }
  function itemRangeText (min: number, max: number, total: number) {
    return (pageSize > total ? total + ' ' : `${min}-${max} of ${total} `) + (total !== 1 ? nounPlural : noun)
  }
  function onUpdate (e: CustomEvent<{ page: number, pageSize: number }>) {
    dispatch('update', e.detail)
  }

</script>

<Pagination {...$$restProps} bind:page {totalItems} itemsPerPageText="Per Page:" bind:pageSize {pageSizes} {itemText} {itemRangeText} pageSizeInputDisabled={!chooseSize || totalItems === 0} pageInputDisabled={!totalItems} on:update={onUpdate} />
