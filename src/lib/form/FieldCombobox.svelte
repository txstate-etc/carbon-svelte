<script lang="ts" context="module">
  export interface ComboMenuItem {
    value: any
    label?: string
    disabled?: boolean
  }
</script>
<script lang="ts">
  import { FORM_CONTEXT, FORM_INHERITED_PATH, Field, type FormStore } from '@txstate-mws/svelte-forms'
  import { ComboBox, InlineNotification } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps, getContext } from 'svelte'
  import { equal, isNotBlank } from 'txstate-utils'
  import { feedbackTypeToKind } from './util.js'

  const dispatch = createEventDispatcher()

  interface CarbonComboItem {
    id: string
    text: string
    disabled?: boolean
    create?: boolean
  }

  interface $$Props extends Omit<ComponentProps<ComboBox>, 'items'> {
    path: string
    items?: ComboMenuItem[]
    notNull?: boolean
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
  export let notNull = false
  export let conditional = true
  export let defaultValue: any = undefined
  export let placeholder = 'Select' + ($$restProps.labelText ? ' ' + $$restProps.labelText : '')
  export let inputvalue = ''
  export let allowFreeEntry = false
  export let freeEntryText = (str: string) => `create "${str}"`
  export let serialize: ((value: any) => string) | undefined = undefined
  export let deserialize: ((value: string) => any) | undefined = undefined

  const store = getContext<FormStore>(FORM_CONTEXT)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotBlank).join('.')
  const val = store.getField(finalPath)

  let finalDeserialize: (value: string) => any
  let finalSerialize: (value: any) => string
  function init (fDes: any, fSrl: any) {
    if (fDes !== finalDeserialize) finalDeserialize = fDes
    if (fSrl !== finalSerialize) finalSerialize = fSrl
    return ''
  }

  $: transformedItems = [
    ...(allowFreeEntry && isNotBlank(inputvalue) && finalDeserialize?.(inputvalue) !== $val && !items.some(o => [(o.value.toLocaleLowerCase?.() ?? o.value), o.label?.toLocaleLowerCase()].includes(inputvalue.toLocaleLowerCase())) ? [{ id: inputvalue, text: freeEntryText(inputvalue), create: true }] : []),
    ...($val && !items.some(o => equal(o.value, $val)) ? [{ id: $val, text: $val }] : []),
    ...items.map(itm => ({ id: finalSerialize(itm.value), text: itm.label ?? finalSerialize(itm.value), disabled: itm.disabled }))] as CarbonComboItem[]

  function onUpdate (setVal: any, deserialize: any) {
    return (e: CustomEvent<{ selectedId: string, selectedItem: CarbonComboItem }>) => {
      const deserialized = deserialize(e.detail.selectedId)
      setVal(deserialized)
      dispatch('select', deserialized)
      if (e.detail.selectedItem?.create) e.detail.selectedItem.text = e.detail.selectedId
    }
  }

  function onClear (setVal: any, deserialize: any) {
    return () => {
      const deserialized = deserialize('')
      setVal(deserialized)
      dispatch('select', deserialized)
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
<Field {path} {notNull} {conditional} {defaultValue} {serialize} {deserialize} let:invalid let:messages let:value let:onBlur let:setVal let:serialize={fSerialize} let:deserialize={fDeserialize} let:path={fullpath}>
  {init(fDeserialize, fSerialize)}
  {@const firstMsg = messages.filter(m => m.type === 'error').map(m => m.message).slice(0, 1)[0]}
  {@const restMsgs = messages.filter(m => m.message !== firstMsg)}
  <ComboBox {...$$restProps} {placeholder} name={fullpath} {invalid} invalidText={firstMsg} selectedId={value} aria-invalid={invalid}
    items={transformedItems}
    shouldFilterItem={$$restProps.shouldFilterItem ?? ((item, ipt) => item.text.toLocaleLowerCase().includes(ipt.toLocaleLowerCase()))}
    bind:value={inputvalue}
    on:select={onUpdate(setVal, fDeserialize)}
    on:clear={onClear(setVal, fDeserialize)}
    on:focus
    on:blur={() => { onBlur(); dispatch('blur') }}
  />
  {#each restMsgs as message}
    <InlineNotification kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</Field>
