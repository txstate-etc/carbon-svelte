<script lang="ts" context="module">
  export interface CarbonMultiItem {
    id: string
    text: string
    disabled?: boolean
    create?: boolean
  }
</script>
<script lang="ts">
  import { FORM_CONTEXT, FORM_INHERITED_PATH, Field, defaultDeserialize, type FormStore, numberDeserialize, numberSerialize, defaultSerialize } from '@txstate-mws/svelte-forms'
  import { InlineNotification, MultiSelect } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps, getContext } from 'svelte'
  import { equal, isNotBlank } from 'txstate-utils'
  import { feedbackTypeToKind } from './util.js'
  import type { ComboMenuItem } from './FieldCombobox.svelte'

  const dispatch = createEventDispatcher()

  interface $$Props extends Omit<ComponentProps<MultiSelect>, 'items'> {
    path: string
    items?: ComboMenuItem[]
    conditional?: boolean
    defaultValue?: any
    placeholder?: string
    inputvalue?: string
    allowFreeEntry?: boolean
    freeEntryText?: (str: string) => string
    serialize?: ((value: any) => string)
    deserialize?: ((value: string) => any)
  }

  export let path: string
  export let items: ComboMenuItem[] = []
  export let conditional = true
  export let defaultValue: any = []
  export let placeholder = 'Select' + ($$restProps.labelText ? ' ' + $$restProps.labelText : '')
  export let inputvalue = ''
  export let allowFreeEntry = false
  export let freeEntryText = (str: string) => `create "${str}"`
  export let number = false
  export let serialize: ((value: any) => string) = number ? numberSerialize : defaultSerialize
  export let deserialize: ((value: string) => any) = number ? numberDeserialize : defaultDeserialize

  const store = getContext<FormStore>(FORM_CONTEXT)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotBlank).join('.')
  const val = store.getField<any[]>(finalPath)

  function arraySerialize (vals: any[]): any {
    return vals?.map(serialize) ?? []
  }
  function arrayDeserialize (vals: any): any {
    return vals?.map(deserialize) ?? []
  }

  $: transformedItems = [
    ...(allowFreeEntry && isNotBlank(inputvalue) && !arraySerialize($val).map((v: string) => v.toLocaleLowerCase()).includes(inputvalue.toLocaleLowerCase()) && !items.some(o => [(o.value.toLocaleLowerCase?.() ?? o.value), o.label?.toLocaleLowerCase()].includes(inputvalue.toLocaleLowerCase())) ? [{ id: inputvalue, text: freeEntryText(inputvalue), create: true }] : []),
    ...(arraySerialize($val?.filter(v => !items.some(o => equal(o.value, v)))).map((v: string) => ({ id: v, text: v })) ?? []),
    ...items.map(itm => ({ id: serialize(itm.value), text: itm.label ?? serialize(itm.value), disabled: itm.disabled }))] as CarbonMultiItem[]

  function onUpdate (setVal: any) {
    return (e: CustomEvent<{ selectedIds: string[], selected: CarbonMultiItem[] }>) => {
      const deserialized = arrayDeserialize(e.detail.selectedIds)
      setVal(deserialized)
      dispatch('select', deserialized)
      inputvalue = ''
      for (const selectedItem of e.detail.selected ?? []) if (selectedItem.create) selectedItem.text = selectedItem.id
    }
  }

  function onClear (setVal: any) {
    return () => {
      setVal([])
      dispatch('select', [])
    }
  }
</script>
<!--
  @component

  By default this component expects values to be strings. If you wish to use other types of values, you
  must provide a `serialize` and `deserialize` function. If you set the `number` prop, an appropriate
  serializer and deserializer will be provided by default. However, mixing numbers and strings would not work.
  For that you should provide your own serialize and deserialize functions.
-->
<Field {path} notNull {conditional} {defaultValue} serialize={arraySerialize} deserialize={arrayDeserialize} let:invalid let:messages let:value let:onBlur let:setVal let:path={fullpath}>
  {@const firstMsg = messages.filter(m => m.type === 'error').map(m => m.message).slice(0, 1)[0]}
  {@const restMsgs = messages.filter(m => m.message !== firstMsg)}
  <MultiSelect {...$$restProps} filterable={$$restProps.filterable ?? allowFreeEntry} {placeholder} name={fullpath} {invalid} invalidText={firstMsg}
    selectedIds={value}
    items={transformedItems}
    sortItem={() => {}}
    aria-invalid={invalid}
    bind:value={inputvalue}
    on:select={onUpdate(setVal)}
    on:clear={onClear(setVal)}
    on:focus
    on:blur={() => { onBlur(); dispatch('blur') }}
    on:keydown
    on:keydown={e => { if (e.key === 'Enter') e.preventDefault() }}
  />
  {#each restMsgs as message}
    <InlineNotification kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</Field>

<!-- TODO: contribute accessibility fixes to Multiselect -->
