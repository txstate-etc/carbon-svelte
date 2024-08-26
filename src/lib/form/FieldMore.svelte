<script lang="ts" context="module">
  export const DG_DIALOG_FIELD_MULTIPLE = {}
</script>
<script lang="ts">
  import { AddMore, FORM_CONTEXT, FORM_INHERITED_PATH } from '@txstate-mws/svelte-forms'
  import type { FormStore } from '@txstate-mws/svelte-forms'
  import { derivedStore } from '@txstate-mws/svelte-store'
  import { Button, FormGroup, InlineNotification } from 'carbon-components-svelte'
  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte'
  import ArrowUp from 'carbon-icons-svelte/lib/ArrowUp.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import { getContext, setContext } from 'svelte'
  import { isNotNull } from 'txstate-utils'
  import { feedbackTypeToKind } from './util.js'

  export let path: string
  export let legendText: string | undefined = undefined
  export let initialState: any | ((index: number) => any) = undefined
  export let minLength = 1
  export let maxLength: number | undefined = undefined
  export let removable = true
  export let reorder = false
  export let conditional: boolean | undefined = undefined
  export let addMoreText = 'Add'
  export let maxedText = addMoreText
  export let helperText: string | undefined = undefined
  /**
   * If you want to ask users if they're sure before removing an array element, fill this
   * prop with the question that should be in the confirmation dialog.
   *
   * Alternatively, you can provide a function to generate the question from the item being
   * deleted. e.g. (item) => `Are you sure you want to delete ${item.name}?`
   */
  export let confirmDelete: string | ((item: any) => string) | undefined = undefined

  const fieldMultipleContext: { helptextid: string | undefined } = { helptextid: undefined }
  setContext(DG_DIALOG_FIELD_MULTIPLE, fieldMultipleContext)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotNull).join('.')
  const store = getContext<FormStore>(FORM_CONTEXT)
  const messageStore = derivedStore(store, ({ messages }) => messages.all.filter(m => m.path === finalPath))
  const invalidStore = derivedStore(messageStore, messages => messages.some(m => m.type === 'error'))

  const reorderupelements: HTMLButtonElement[] = []
  const reorderdownelements: HTMLButtonElement[] = []
  function moveUpAndFocus (onMove: () => void, idx: number) {
    return (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onMove()
      let newFocus = reorderupelements[idx - 1]
      if (newFocus) {
        if (newFocus.disabled) newFocus = reorderdownelements[idx - 1]
        newFocus.focus()
      }
    }
  }
  function moveDownAndFocus (onMove: () => void, idx: number) {
    return (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onMove()
      let newFocus = reorderdownelements[idx + 1]
      if (newFocus) {
        if (newFocus.disabled) newFocus = reorderupelements[idx + 1]
        newFocus.focus()
      }
    }
  }

  function confirmedDelete (onDelete: () => void, item: any) {
    return (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (confirmDelete == null) { onDelete(); return }
      const msg = typeof confirmDelete === 'string' ? confirmDelete : confirmDelete(item)
      if (confirm(msg)) onDelete()
    }
  }
</script>
<FormGroup {legendText} invalid={$invalidStore}>
  {helperText}
  <AddMore {path} {initialState} {minLength} {maxLength} {conditional} let:path={fPath} let:currentLength let:maxLength={mLength} let:index let:minned let:maxed let:value let:onDelete let:onMoveUp let:onMoveDown>
    {@const showDelete = removable && !minned}
    {@const showMove = reorder && currentLength > 1}
    <div class="dialog-multiple" class:first={index === 0}>
      <div class="dialog-multiple-content">
        <slot {path} {index} {value} {maxed} {maxLength} {currentLength}/>
      </div>
      {#if showDelete || showMove}<div class="dialog-multiple-buttons">
        {#if showMove}
          <Button type="button" bind:ref={reorderdownelements[index]} size="small" kind="tertiary"
            disabled={index === currentLength - 1}
            on:click={moveDownAndFocus(onMoveDown, index)}
            icon={ArrowDown}
            iconDescription="move down in the list"
          />
          <Button type="button" bind:ref={reorderupelements[index]} size="small" kind="tertiary"
            disabled={index === 0}
            on:click={moveUpAndFocus(onMoveUp, index)}
            icon={ArrowUp}
            iconDescription="move up in the list"
          />
        {/if}
        {#if showDelete}
          <Button type="button" on:click={confirmedDelete(onDelete, value)}
            size="small" kind="tertiary"
            icon={TrashCan}
            iconDescription="remove from list"
          />
        {/if}
      </div>{/if}
    </div>
    <svelte:fragment slot="addbutton" let:maxed let:maxLength let:onClick>
      {#if !maxed || (maxed && maxLength > 1)}
        <Button type="button" size="small" kind="tertiary" icon={Add} disabled={maxed} on:click={onClick}>{maxed ? maxedText : addMoreText}</Button>
      {/if}
    </svelte:fragment>
  </AddMore>
  {#each $messageStore as message}
    <InlineNotification lowContrast kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</FormGroup>
<style>
  .dialog-multiple {
    position: relative;
    border: var(--dialog-container-border, 1px dashed #CCCCCC);
    padding: var(--dialog-container-padding, 1.5em);
    padding-top: max(var(--dialog-container-padding, 1.5em), 2.5rem);
  }
  .dialog-multiple:not(.first) {
    border-top: 0;
  }
  .dialog-multiple:nth-of-type(even) {
    background-color: var(--dialog-field-bg1, transparent);
    color: var(--dialog-field-text1, inherit);
  }
  .dialog-multiple:nth-of-type(odd) {
    background-color: var(--dialog-field-bg2, transparent);
    color: var(--dialog-field-text2, inherit);
  }
  .dialog-multiple-buttons {
    position: absolute;
    top: 0;
    right: 0.1em;
    display: flex;
  }
</style>
