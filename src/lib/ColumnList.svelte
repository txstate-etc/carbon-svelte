<script lang="ts">
  import { ResizeStore, ScreenReaderOnly, resize } from '@txstate-mws/svelte-components'
  import { ActiveStore } from '@txstate-mws/svelte-store'
  import { ChevronRight, ChevronDown } from 'carbon-icons-svelte'
  import { randomid, roundTo } from 'txstate-utils'
  import { type ActionItem, type ColumnDefinition, ActionSet } from '$lib/index.js'

  type T = $$Generic<{ id: string }>

  export let columns: ColumnDefinition<T>[]
  export let rows: T[]
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

  const store = new ResizeStore({ clientWidth: 1024 })
  const listId = randomid()
  const expandedRows = new ActiveStore(new Set<string>())
  const selectedRows = new ActiveStore(new Set<string>())

  function getByKey (row: any, key: any) {
    return row[key]
  }

  function onSelectRow (row: T) {
    return () => {
      selectedRows.update(v => {
        v.add(row.id)
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

  $: actionButtons = $store.clientWidth! > 800 ? 2 : 1
  $: actionColWidth = `calc((2.5rem + 2px) * ${actionButtons})`
  $: checkboxColWidth = 'calc(13px + 16px)'
  $: expandableColWidth = 'calc(1rem + 16px)'
  $: showingColumnIds = new Set(responsiveColumns?.($store.clientWidth!) ?? columns.map(c => c.id))
  $: showingColumns = columns.filter(c => showingColumnIds.has(c.id))
  $: baseWidth = roundTo(100.0 / showingColumns.length, 2) + '%'
</script>

<div use:resize={{ store }} class="column-list" role="list">
  <div class="column-list-head [ flex ]">
    {#if selectedActions != null}<div class="column-list-colhead select-all [ p-[8px] ]" style:flex-basis={checkboxColWidth}>{#if !noSelectAll}<input type="checkbox">{/if}</div>{/if}
    {#if expandable}<div class="column-list-colhead expand" style:flex-basis={expandableColWidth}>&nbsp;</div>{/if}
    {#each showingColumns as col}
      <div id="{listId}-{col.id}" class="column-list-colhead [ p-[8px] font-bold ]" style:flex-grow={col.grow ?? (col.fixed ? undefined : 1)} style:flex-basis={col.fixed ?? baseWidth}>{col.label}</div>
    {/each}
    {#if actions}<div class="column-list-colhead actions" style:flex-basis={actionColWidth}>&nbsp;</div>{/if}
  </div>
  {#each rows as row (row.id)}
    {@const isExpandable = typeof expandable === 'boolean' ? expandable : expandable(row)}
    <div class="column-list-row" role="listitem">
      <div class="column-list-cols [ flex ]">
        {#if selectedActions}
          <div class="column-list-col checkbox" style:flex-basis={checkboxColWidth}>
            <label><input type="checkbox" checked={$selectedRows.has(row.id)} aria-describedby="{listId}-{row.id}" on:change={onSelectRow(row)}><ScreenReaderOnly>select row</ScreenReaderOnly></label>
          </div>
        {/if}
        {#if isExpandable}
          <div class="column-list-col expand" style:flex-basis={expandableColWidth}><button type="button" on:click={onExpandRow(row)}>
            {#if $expandedRows.has(row.id)}
              <ChevronDown />
            {:else}
              <ChevronRight />
            {/if}
            <ScreenReaderOnly>Expand Row</ScreenReaderOnly>
          </button></div>
        {/if}
        {#each showingColumns as col}
          {@const resolvedIcon = typeof col.icon === 'function' ? col.icon(row) : col.icon}
          <div class="column-list-col {col.id} [ p-[8px] ]" style:flex-grow={col.grow ?? (col.fixed ? undefined : 1)} style:flex-basis={col.fixed ?? baseWidth}>
            {#if resolvedIcon}
              <span class="icon">
                <svelte:component this={resolvedIcon.icon}/>
                {#if resolvedIcon.label}<ScreenReaderOnly>{resolvedIcon.label}</ScreenReaderOnly>{/if}
              </span>
            {/if}
            {#if col.component}
              <svelte:component this={col.component} {row} {col} />
            {:else if col.render}
              {@html col.render(row)}
            {:else if col.get}
              {getByKey(row, col.get) || '&nbsp;'}
            {/if}
          </div>
        {/each}
        {#if actions}
          <div class="column-list-col actions" style:flex-basis={actionColWidth}>
            <ActionSet actions={actions(row)} small maxButtons={actionButtons} describedById="{listId}-{row.id}" />
          </div>
        {/if}
      </div>
      {#if isExpandable && $expandedRows.has(row.id)}
        <div class="column-list-expandable">
          <slot {row} />
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .column-list-head {
    background-color: var(--cds-layer-accent, #e0e0e0);
  }
  .column-list-col {
    padding: 8px;
  }
  .column-list-cols {
    background-color: var(--cds-layer, #f4f4f4);
  }
  .column-list-col.actions {
    padding: 0;
    display: flex;
    align-items: center;
  }
</style>
