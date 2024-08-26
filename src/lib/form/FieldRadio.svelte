<script lang="ts" context="module">
  export interface RadioMenuItem {
    value: any
    label?: string
    disabled?: boolean
  }
</script>
<script lang="ts">
  import { FORM_CONTEXT, FORM_INHERITED_PATH, Field, type FormStore } from '@txstate-mws/svelte-forms'
  import { Store } from '@txstate-mws/svelte-store'
  import { RadioButtonGroup, RadioButton, InlineNotification } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps, getContext } from 'svelte'
  import { get, isNotBlank, equal } from 'txstate-utils'
  import { feedbackTypeToKind } from './util.js'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<RadioButtonGroup> {
    path: string
    items: RadioMenuItem[]
    number?: boolean
    boolean?: boolean
    notNull?: boolean
    conditional?: boolean
    defaultValue?: string | number | boolean
    serialize?: ((value: any) => string)
    deserialize?: ((value: string) => any)
  }

  export let path: string
  export let items: RadioMenuItem[]
  export let number = false
  export let boolean = false
  export let notNull = false
  export let conditional = true
  export let defaultValue: any = undefined
  export let serialize: ((value: any) => string) | undefined = undefined
  export let deserialize: ((value: string) => any) | undefined = undefined

  const store = getContext<FormStore>(FORM_CONTEXT)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotBlank).join('.')

  const itemStore = new Store(items)
  $: itemStore.set(items)

  function onUpdate (setVal: any, deserialize: any) {
    return (e: CustomEvent<string | number>) => {
      const deserialized = deserialize(String(e.detail))
      setVal(deserialized)
      dispatch('update', deserialized)
    }
  }

  let finalDeserialize: (value: string) => any
  function init (fDes: any): any {
    if (fDes !== finalDeserialize) finalDeserialize = fDes
    return ''
  }

  async function reactToItems (..._: any[]) {
    if (!finalDeserialize) return
    if (!items.length) {
      return await store.setField(finalPath, finalDeserialize(''))
    }
    const val = get($store.data, finalPath)
    if (!items.some(o => equal(o.value, val))) await store.setField(finalPath, notNull && items.some(o => equal(o.value, defaultValue)) ? defaultValue : finalDeserialize(''))
  }
  $: reactToItems($itemStore, finalDeserialize).catch(console.error)
</script>
<!--
  @component

  By default this component expects values to be strings. If you wish to use other types of values, you
  must provide a `serialize` and `deserialize` function. If you set the `number` prop, an appropriate
  serializer and deserializer will be provided by default. However, mixing numbers and strings would not work.
  For that you should provide your own serialize and deserialize functions.

  If your `items` are not ready on first load (e.g. they're being loaded from an API fetch), you must
  place this field inside an `{#if}` block until they are ready. Otherwise, the preload state will be
  overwritten with the default value because it ensures the value is always in the available items.
-->
<Field {path} {notNull} {conditional} {defaultValue} {boolean} {number} {serialize} {deserialize} let:messages let:value let:invalid let:onBlur let:setVal let:serialize={fSerialize} let:deserialize={fDeserialize} let:path={fullpath}>
  {init(fDeserialize)}
  <div on:focusin={() => dispatch('focus')} on:focusout={() => { onBlur(); dispatch('blur') }}>
    <RadioButtonGroup {...$$restProps} name={fullpath}
      selected={value}
      on:change={onUpdate(setVal, fDeserialize)}
    >
      {#each $itemStore as item (item.value)}
        {@const srlzd = fSerialize(item.value)}
        <RadioButton value={srlzd} labelText={item.label ?? srlzd} disabled={!!item.disabled} aria-invalid={invalid} />
      {/each}
    </RadioButtonGroup>
  </div>
  {#each messages as message}
    <InlineNotification lowContrast kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</Field>
