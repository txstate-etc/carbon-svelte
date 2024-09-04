<script lang="ts" context="module">
  import { equal, randomid } from 'txstate-utils'
  export interface SelectMenuItem {
    value: any
    label?: string
    disabled?: boolean
    group?: string
  }
  const defaultGroup = 'select_group_' + randomid()
</script>
<script lang="ts">
  import { FORM_CONTEXT, FORM_INHERITED_PATH, Field, type FormStore } from '@txstate-mws/svelte-forms'
  import { Store } from '@txstate-mws/svelte-store'
  import { InlineNotification, Select, SelectItem, SelectItemGroup } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps, getContext } from 'svelte'
  import { get, groupby, isNotBlank } from 'txstate-utils'
  import { feedbackTypeToKind } from './util.js'
  import { FormInlineNotification } from './index.js'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<Select> {
    path: string
    items: SelectMenuItem[]
    number?: boolean
    notNull?: boolean
    conditional?: boolean
    defaultValue?: any
    placeholder?: string
    serialize?: ((value: any) => string)
    deserialize?: ((value: string) => any)
  }

  export let path: string
  export let items: SelectMenuItem[]
  export let number = false
  export let notNull = false
  export let conditional = true
  export let defaultValue: any = undefined
  export let placeholder = 'Select' + ($$restProps.labelText ? ' ' + $$restProps.labelText : '')
  export let serialize: ((value: any) => string) | undefined = undefined
  export let deserialize: ((value: string) => any) | undefined = undefined

  const store = getContext<FormStore>(FORM_CONTEXT)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotBlank).join('.')

  const itemStore = new Store(items)
  $: itemStore.set(items)
  $: grouped = groupby($itemStore, item => item.group ?? defaultGroup)

  function onUpdate (setVal: any, deserialize: any) {
    return (e: CustomEvent<string | number>) => {
      const deserialized = deserialize(String(e.detail))
      setVal(deserialized)
      dispatch('update', deserialized)
    }
  }

  let finalDeserialize: (value: string) => any
  function init (fDes: any) {
    if (fDes !== finalDeserialize) finalDeserialize = fDes
    return ''
  }

  async function reactToItems (..._: any[]) {
    if (!finalDeserialize) return
    if (!items.length) {
      return await store.setField(finalPath, finalDeserialize(''))
    }
    const val = get($store.data, finalPath)
    if (!items.some(o => equal(o.value, val))) await store.setField(finalPath, notNull ? defaultValue : finalDeserialize(''))
  }
  $: reactToItems($itemStore, finalDeserialize).catch(console.error)
</script>
<!--
  @component

  By default this component expects values to be strings. If you wish to use other types of values, you
  must provide a `serialize` and `deserialize` function. If you set the `number` prop, an appropriate
  serializer and deserializer will be provided by default. However, mixing numbers and strings would not work.
  For that you should provide your own serialize and deserialize functions.
-->
<Field {path} {notNull} {conditional} {defaultValue} {number} {serialize} {deserialize} let:invalid let:messages let:value let:onBlur let:setVal let:deserialize={fDeserialize} let:path={fullpath}>
  {init(fDeserialize)}
  {@const firstMsg = messages.filter(m => m.type === 'error').map(m => m.message).slice(0, 1)[0]}
  {@const restMsgs = messages.filter(m => m.message !== firstMsg)}
  <Select {...$$restProps} name={fullpath} {invalid} invalidText={firstMsg} selected={value}
    aria-invalid={invalid}
    on:update={onUpdate(setVal, fDeserialize)}
    on:blur={() => { onBlur(); dispatch('blur') }}
    on:change on:input on:focus
  >
    {#if !notNull}
      <SelectItem value="" text={placeholder} />
    {/if}
    {#each Object.entries(grouped) as [group, groupitems]}
      {#if group === defaultGroup}
        {#each groupitems as item (item.value)}
          <SelectItem value={String(item.value)} text={item.label} disabled={!!item.disabled} />
        {/each}
      {:else}
      <SelectItemGroup label={group}>
        {#each groupitems as item (item.value)}
          <SelectItem value={String(item.value)} text={item.label} disabled={!!item.disabled} />
        {/each}
      </SelectItemGroup>
      {/if}
    {/each}
  </Select>
  {#each restMsgs as message}
    <FormInlineNotification {message} lowContrast hideCloseButton />
  {/each}
</Field>
