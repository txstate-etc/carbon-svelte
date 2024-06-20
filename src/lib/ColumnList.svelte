<script lang="ts">
  import { ResizeStore, ScreenReaderOnly, glue, resize } from '@txstate-mws/svelte-components'
  import { ActiveStore } from '@txstate-mws/svelte-store'
  import { Button } from 'carbon-components-svelte'
  import { ChevronDown, ChevronUp, Filter } from 'carbon-icons-svelte'
  import { isNotNull, keyby, pluralize, randomid, roundTo } from 'txstate-utils'
  import { type ActionItem, type ColumnDefinition, ActionSet, OptionalLink, PanelFormDialog, TagSet } from '$lib/index.js'

  type T = $$Generic<{ id: string }>

  export let columns: ColumnDefinition<T>[]
  export let rows: T[]
  /**
   * A descriptive title for the list. Will be used as the aria-label for the list and to
   * provide context in various places.
   */
  export let title: string
  /**
   * As the available width for the table shrinks, we often want to hide columns to avoid getting
   * too crowded. Provide this function to enable this functionality.
   *
   * Given a width for the table, return the list of column ids that should be displayed by default.
   * The final column you list will be eligible to be replaced by another user-selected column. This
   * way the user can eventually access all the content even on a small device.
   */
  export let responsiveColumns: ((width: number) => string[]) | undefined = undefined
  /**
   * If you provide content in the default slot, we automatically add expansion arrows
   * to every row. Provide this prop to adjust that behavior - either turn off expansion
   * arrows entirely or provide a function to specify which rows should have one.
   */
  export let expandable: boolean | ((row: T) => boolean) = $$slots.default ?? false
  /**
   * If you provide content in the default slot and want it to be shown for every row instead
   * of being something the user has to expand, set this prop.
   */
  export let expanded = false
  /**
   * If you provide selectedActions, the table will automatically render checkboxes next
   * to each row. You do not need to list the checkbox column in your `columns` column definitions.
   */
  export let selectedActions: undefined | ((rows: T[]) => ActionItem[]) = undefined
  /**
   * By default, if selectedActions is provided, there will be a way to check/uncheck all
   * rows at once. Set this true to remove that functionality
   */
  export let noSelectAll = false
  /**
   * Optionally specify a list of actions for each row. They will be placed in a column on
   * the far right. You do not need to list the actions column in your `columns` column
   * definitions.
   */
   export let actions: undefined | ((row: T) => ActionItem[]) = undefined
   /**
    * Optionally specify a list of actions to appear at the top of the table.
    *
    * For a bad example, a button to create a new list item could go here. However, for
    * actions that manipulate the list, like create or import, consider using a
    * Panel or MainPanel component instead, for better consistency with card-grid lists.
    *
    * A truly good use case for this would be an action that pertains to the display of the
    * table itself, like some sort of settings functionality, or opening a dialog with a chart.
    */
   export let listActions: ActionItem[] = []

  const store = new ResizeStore({ clientWidth: 1024 })
  const listId = randomid()
  const expandedRows = new ActiveStore(new Set<string>())
  const selectedRows = new ActiveStore(new Set<string>())
  $: allSelected = $selectedRows.size === rows.length
  $: someSelected = !allSelected && !!$selectedRows.size
  let filterbutton: HTMLButtonElement

  function getByKey (row: any, key: any) {
    return row[key]
  }

  function onSelectRow (row: T) {
    return (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
      selectedRows.update(v => {
        if (e.currentTarget.checked) v.add(row.id)
        else v.delete(row.id)
        return v
      })
    }
  }

  function onSelectAll (e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    if (!allSelected) {
      selectedRows.update(v => {
        for (const row of rows) v.add(row.id)
        return v
      })
    } else {
      selectedRows.update(v => {
        v.clear()
        return v
      })
    }
  }

  function onExpandRow (row: T) {
    return () => {
      expandedRows.update(v => {
        if (v.has(row.id)) v.delete(row.id)
        else v.add(row.id)
        return v
      })
    }
  }

  let panelDialogOpen = false
  let smallfilterdialog: HTMLDialogElement
  function onFilterClick () {
    if (smallfilterdialog) {
      if (!smallfilterdialog.open) smallfilterdialog.showModal()
      else smallfilterdialog.close()
    } else {
      panelDialogOpen = true
    }
  }

  function smallFilterClick (e: MouseEvent) {
    if (smallfilterdialog === e.target) smallfilterdialog.close()
  }

  let overflowcontainer: HTMLDivElement
  let activeColumn: string | undefined
  function activateColumn (col: ColumnDefinition<T>) {
    return () => {
      activeColumn = col.id
    }
  }

  $: maxActions = Math.max(...rows.map(r => actions?.(r)?.length ?? 0))
  $: actionButtons = $store.clientWidth! > 800 ? Math.min(2, maxActions) : 1
  $: actionColWidth = `calc((2.5rem + 2px) * ${actionButtons})`
  $: checkboxColWidth = 'calc(13px + 16px)'
  $: expandableColWidth = 'calc(16px + 24px)'
  $: columnsById = keyby(columns, 'id')
  $: responsiveColumnIds = responsiveColumns?.($store.clientWidth!) ?? columns.map(c => c.id)
  $: showingColumnIds = columnsById[activeColumn!] ? [...responsiveColumnIds.slice(0, -1), activeColumn!] : responsiveColumnIds
  $: showingColumnIdSet = new Set(showingColumnIds)
  $: showingColumns = showingColumnIds.map(id => columnsById[id]).filter(isNotNull)
  $: missingColumns = columns.filter(c => !showingColumnIdSet.has(c.id))
  $: baseWidth = '1px'
  $: currentSelectedActions = $selectedRows.size === 0 ? [] : selectedActions?.(rows.filter(r => $selectedRows.has(r.id))) ?? []
</script>

{#if selectedActions}
  <div class="column-list-selections [ flex items-center min-h-8 ]">
    <div id="{listId}-with-selected-desc" class="[ mr-[8px] ]">{pluralize('row', $selectedRows.size, true)} selected...</div>
    <ActionSet actions={currentSelectedActions} describedById="{listId}-with-selected-desc" small maxButtons={4} />
    <div class="[ flex-grow ]"></div>
    <!-- add a search UI here -->
    {#if $$slots.smallFilters || $$slots.filters}
      <Button bind:ref={filterbutton} size="small" icon={Filter} iconDescription="Filters" aria-describedby="{listId}-list-title" on:click={onFilterClick} />
    {/if}
    <ActionSet actions={listActions} describedById="{listId}-list-title" small maxButtons={4} />
  </div>
{/if}
<div use:resize={{ store }} class="column-list" role="list" aria-labelledby="{listId}-list-title">
  <div hidden aria-hidden="true" id="{listId}-list-title">{title}</div>
  <div class="column-list-head [ flex items-center ]">
    {#if selectedActions != null}<div class="column-list-colhead select-all [ px-[8px] py-[6px] ]" style:flex-basis={checkboxColWidth}>{#if !noSelectAll}<div class:bx--checkbox-inline={true}><input id="{listId}-select-all" type="checkbox" bind:indeterminate={someSelected} checked={allSelected} class:bx--checkbox={true} on:change={onSelectAll}><label for="{listId}-select-all" class:bx--checkbox-label={true}><ScreenReaderOnly>{allSelected ? 'deselect' : 'select'} all</ScreenReaderOnly></label></div>{/if}</div>{/if}
    {#if expandable}<div class="column-list-colhead expand" style:flex-basis={expandableColWidth}>&nbsp;</div>{/if}
    {#each showingColumns as col}
      <div id="{listId}-{col.id}" class="column-list-colhead [ p-[8px] font-bold ]" style:flex-grow={col.grow ?? (col.fixed ? undefined : 1)} style:flex-basis={col.fixed ?? baseWidth}>{col.label}</div>
    {/each}
    {#if actions}<div class="column-list-colhead actions" style:flex-basis={actionColWidth}>&nbsp;</div>{/if}
    {#if missingColumns.length}
      <div bind:this={overflowcontainer} class="column-list-overflow">
        <div hidden aria-hidden="true" id="{listId}-overflow">reveal column for {title}</div>
        <ActionSet actions={missingColumns.map(c => ({ label: c.label, onClick: activateColumn(c) }))} forceOverflow describedById="{listId}-overflow" small />
      </div>
    {/if}
  </div>
  {#each rows as row (row.id)}
    {@const isExpandable = typeof expandable === 'boolean' ? expandable : expandable(row)}
    <div class="column-list-row" role="listitem">
      <div class="column-list-cols [ flex items-start ]">
        {#if selectedActions}
          <div class="column-list-col checkbox" style:flex-basis={checkboxColWidth}>
            <div class:bx--checkbox-inline={true}>
              <input id="{listId}-select-{row.id}" type="checkbox" class:bx--checkbox={true} aria-describedby="{listId}-{row.id}" checked={$selectedRows.has(row.id)} on:change={onSelectRow(row)}>
              <label for="{listId}-select-{row.id}" class:bx--checkbox-label={true}><ScreenReaderOnly>select row</ScreenReaderOnly></label>
            </div>
          </div>
        {/if}
        {#if isExpandable}
          <div class="column-list-col expand" style:flex-basis={expandableColWidth}><button type="button" on:click={onExpandRow(row)}>
            {#if $expandedRows.has(row.id)}
              <ChevronUp size={24} />
            {:else}
              <ChevronDown size={24} />
            {/if}
            <ScreenReaderOnly>Expand Row</ScreenReaderOnly>
          </button></div>
        {/if}
        {#each showingColumns as col}
          {@const tags = col.tags?.(row)}
          {@const resolvedIcon = typeof col.icon === 'function' ? col.icon(row) : col.icon}
          <div class="column-list-col {col.id} [ p-[8px] ]" style:flex-grow={col.grow ?? (col.fixed ? undefined : 1)} style:flex-basis={col.fixed ?? baseWidth}>
            <OptionalLink href={col.href?.(row)} on:click={e => { e.preventDefault() }}>
              {#if resolvedIcon}
                <span class="icon">
                  <svelte:component this={resolvedIcon.icon} />
                  {#if resolvedIcon.label}<ScreenReaderOnly>{resolvedIcon.label}</ScreenReaderOnly>{/if}
                </span>
              {/if}
              {#if col.component}
                <svelte:component this={col.component} {row} {col} />
              {:else if tags}
                <TagSet {tags} small />
              {:else if col.render}
                {@html col.render(row)}
              {:else if col.get}
                <span>{getByKey(row, col.get) || '&nbsp;'}</span>
              {/if}
            </OptionalLink>
          </div>
        {/each}
        {#if actions}
          <div class="column-list-col actions" style:flex-basis={actionColWidth}>
            <ActionSet actions={actions(row)} small maxButtons={actionButtons} describedById="{listId}-{row.id}" />
          </div>
        {/if}
      </div>
      {#if expanded || (isExpandable && $expandedRows.has(row.id))}
        <div class="column-list-expandable [ p-[8px] ]" style:padding-left="calc(8px + {selectedActions ? checkboxColWidth : '0px'})">
          <slot {row} />
        </div>
      {/if}
    </div>
  {/each}
</div>
{#if $$slots.filters}
  <PanelFormDialog bind:open={panelDialogOpen} title="Filters">
    <slot name="filters" />
  </PanelFormDialog>
{/if}
{#if $$slots.smallFilters}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <dialog bind:this={smallfilterdialog} class="column-list-smallfilters [ m-0 ]" use:glue={{ target: filterbutton }} on:click={smallFilterClick}>
    <div>
      <slot name="smallFilters" />
    </div>
  </dialog>
{/if}

<style>
  .column-list-head {
    position: relative;
    background-color: var(--cds-layer-accent, #e0e0e0);
  }
  .column-list-overflow {
    margin-right: 2px;
  }
  .column-list-col {
    padding: 8px;
  }
  .column-list-col > :global(a) {
    color: blue;
    text-decoration: underline;
  }
  .column-list-col.expand {
    padding: 6px 8px;
  }
  .column-list-col.expand button {
    display: block;
  }
  .column-list-cols {
    background-color: var(--cds-layer, #f4f4f4);
  }
  .column-list-col.actions {
    padding: 4px 0;
    display: flex;
    align-items: center;
  }
  .column-list-row {
    border-bottom: 1px solid var(--cds-border-subtle, #e0e0e0)
  }
  .icon {
    display: inline-block;
    margin-right: 8px;
    vertical-align: text-bottom;
  }
  .icon + * {
    margin-left: -0.25em;
  }
  .column-list-smallfilters {
    left: unset;
  }
  .column-list-smallfilters::backdrop {
    background: transparent;
  }
</style>
