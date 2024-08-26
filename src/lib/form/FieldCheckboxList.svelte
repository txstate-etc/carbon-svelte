<script lang="ts" context="module">
  import { randomid } from 'txstate-utils'
  export interface CheckboxListItem {
    value: any
    label?: string
    disabled?: boolean
    group?: string
  }
  const defaultGroup = 'checkbox_group_' + randomid()
</script>
<script lang="ts">
  import { modifierKey } from '@txstate-mws/svelte-components'
  import { FORM_CONTEXT, FORM_INHERITED_PATH, Field, type FormStore } from '@txstate-mws/svelte-forms'
  import { Store } from '@txstate-mws/svelte-store'
  import { InlineNotification } from 'carbon-components-svelte'
  import { createEventDispatcher, getContext } from 'svelte'
  import { findIndex, groupby, isNotBlank, isNotNull } from 'txstate-utils'
  import { feedbackTypeToKind } from './util.js'

  const dispatch = createEventDispatcher()

  interface $$Props {
    path: string
    items: CheckboxListItem[]
    number?: boolean
    conditional?: boolean
    defaultValue?: any
    required?: boolean
    readonly?: boolean
    legendText?: string
    helperText?: string
    orientation?: 'horizontal' | 'vertical'
    selectAll?: boolean
    /**
     * This field returns an array, but each checkbox has its own value, which needs
     * to be serialized/deserialized independently.
     */
    serialize?: ((value: any) => string)
    /**
     * This field returns an array, but each checkbox has its own value, which needs
     * to be serialized/deserialized independently.
     */
    deserialize?: ((value: string) => any)
  }

  export let path: string
  export let items: CheckboxListItem[]
  export let number = false
  export let conditional = true
  export let defaultValue: string[] = []
  export let required = false
  export let readonly = false
  export let legendText: string | undefined = undefined
  export let helperText: string | undefined = undefined
  export let orientation = 'vertical'
  export let selectAll = false
  export let serialize: ((value: any) => string) | undefined = undefined
  export let deserialize: ((value: string) => any) | undefined = undefined

  const store = getContext<FormStore>(FORM_CONTEXT)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotBlank).join('.')
  const valStore = store.getField<any[]>(finalPath)
  let finalDeserialize: ((value: string) => any) | undefined
  let finalSerialize: ((value: string) => any) | undefined
  function init (dsrl: any, srl: any) {
    if (dsrl !== finalDeserialize) finalDeserialize = dsrl
    if (srl !== finalSerialize) finalSerialize = srl
    return ''
  }

  let selectallelement: HTMLInputElement | undefined
  const selectallid = randomid()

  const legendId = randomid()
  $: resolvedLegendId = isNotBlank(legendText) ? legendId : undefined
  let selected = new Set<string>()
  let activeCheckbox: string
  const checkboxelements: HTMLInputElement[] = []
  let fieldsetelement: HTMLFieldSetElement

  const itemStore = new Store(items)
  $: itemStore.set(items)
  $: grouped = groupby($itemStore, item => item.group ?? defaultGroup)

  function onChange (setVal: any, deserialize: any) {
    return (e: Event & { currentTarget: HTMLInputElement }) => {
      const value = e.currentTarget?.value
      if (value == null) return
      const checked = e.currentTarget.checked
      if (checked) selected.add(value)
      else selected.delete(value)
      const newVal = Array.from(selected).map(v => deserialize(v))
      setVal(newVal)
      dispatch('update', newVal)
    }
  }

  function onKeydown (e: KeyboardEvent) {
    if (modifierKey(e)) return
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      e.stopPropagation()
      const i = findIndex(items, itm => finalSerialize!(itm.value) === activeCheckbox) ?? -1
      if (i > 0) {
        activeCheckbox = finalSerialize!(items[i - 1].value)
        checkboxelements[i - 1].focus()
      } else if (selectallelement) {
        activeCheckbox = '__selectall'
        selectallelement.focus()
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      e.stopPropagation()
      const i = findIndex(items, itm => finalSerialize!(itm.value) === activeCheckbox) ?? -1
      if (i < (items.length - 1)) {
        activeCheckbox = finalSerialize!(items[i + 1].value)
        checkboxelements[i + 1].focus()
      }
    }
  }

  const checkboxIds: string[] = []
  function getCheckboxId (idx: number) {
    checkboxIds[idx] ??= randomid()
    return checkboxIds[idx]
  }

  // this has to happen before reactToItems so that selected will be filled
  // when reactToItems intersects `selected` and `items` on first run
  $: selected = new Set(finalSerialize && $valStore ? $valStore.map(finalSerialize) : [])

  async function reactToItems (..._: any[]) {
    if (!finalSerialize) return
    const allItems = new Set(items?.filter(itm => !itm.disabled).map(itm => finalSerialize!(itm.value)) ?? [])
    selected = new Set(Array.from(selected).filter(v => allItems.has(v)))
    await store.setField(finalPath, Array.from(selected).map(v => finalDeserialize!(v)))
    if (!activeCheckbox || (!allItems.has(activeCheckbox) && (activeCheckbox !== '__selectall' || !selectallelement))) {
      activeCheckbox = Array.from(allItems)[0]
    }
  }
  $: reactToItems($itemStore, finalSerialize).catch(console.error)

  $: selectallchecked = finalSerialize ? items.every(itm => itm.disabled || selected.has(finalSerialize!(itm.value))) : false
  $: selectallindeterminate = selected.size > 0 && !selectallchecked

  function selectAllChanged () {
    void store.setField(finalPath, selectallchecked ? [] : items.filter(itm => !itm.disabled).map(itm => finalSerialize!(itm.value)))
  }
</script>
<!--
  @component

  By default this component expects values to be strings. If you wish to use other types of values, you
  must provide a `serialize` and `deserialize` function. If you set the `number` prop, an appropriate
  serializer and deserializer will be provided by default. However, mixing numbers and strings would not work.
  For that you should provide your own serialize and deserialize functions.
-->
<Field {path} {conditional} {defaultValue} {number} {serialize} {deserialize} let:invalid let:messages let:onBlur let:setVal let:serialize={fSerialize} let:deserialize={fDeserialize} let:path={fullpath}>
  {init(fDeserialize, fSerialize)}
  <fieldset
    bind:this={fieldsetelement}
    data-invalid={invalid}
    class:bx--fieldset={true} class:bx--fieldset--no-margin={true}
    aria-labelledby={resolvedLegendId}
  >
    {#if legendText}
      <legend class:bx--label={true} id={legendId}>{legendText}</legend>
    {/if}
    {#if helperText}<div id="{legendId}-helper" class:bx--form__helper-text={true}>{helperText}</div>{/if}
    <div role="listbox" class:horizontal={orientation === 'horizontal'}
      aria-multiselectable={true}
      on:focusout={() => { onBlur(); dispatch('blur') }} on:focusin={() => dispatch('focus')}>
      {#if selectAll && !readonly}
        <div class:bx--form-item={true} class:bx--checkbox-wrapper={true}>
          <input id={selectallid} bind:this={selectallelement} type="checkbox"
            class:bx--checkbox={true}
            bind:indeterminate={selectallindeterminate} checked={selectallchecked}
            on:change={selectAllChanged} on:keydown={onKeydown}
            tabindex={activeCheckbox === '__selectall' ? 0 : -1} aria-describedby={resolvedLegendId}
          >
          <label for={selectallid} class:bx--checkbox-label={true}><span class:bx--checkbox-label-text={true}>Select All</span></label>
        </div>
      {/if}
      {#each Object.entries(grouped) as [groupname, groupitems]}
        {#if groupname !== defaultGroup}
          <div class:bx--label={true}>{groupname}</div>
        {/if}
        {#each groupitems as item, i}
          {@const val = fSerialize(item.value)}
          {@const ckId = getCheckboxId(i)}
          <div class:bx--form-item={true} class:bx--checkbox-wrapper={true}>
            <input
              bind:this={checkboxelements[i]}
              type="checkbox"
              value={val}
              checked={selected.has(val)}
              tabindex={activeCheckbox === val ? 0 : -1}
              disabled={item.disabled}
              id={ckId}
              name={fullpath}
              readonly={readonly}
              aria-required={required}
              class:bx--checkbox={true}
              aria-describedby={[resolvedLegendId, `${legendId}-helper`].filter(isNotNull).join(' ')}
              aria-invalid={invalid}
              on:change={onChange(setVal, fDeserialize)}
              on:keydown={onKeydown}
            />
            <label for={ckId} class:bx--checkbox-label={true}>
              <span class:bx--checkbox-label-text={true}>
                <slot name="labelText" {item}>
                  {item.label ?? item.value}
                </slot>
              </span>
            </label>
          </div>
        {/each}
      {/each}
    </div>
    {#each messages as message}
      <InlineNotification lowContrast kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
    {/each}
  </fieldset>
</Field>

<style>
  .horizontal {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .horizontal > * {
    width: min(max(10em, 25%), 50%)
  }
</style>
