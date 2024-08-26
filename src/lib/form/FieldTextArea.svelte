<script lang="ts">
  import { Field } from '@txstate-mws/svelte-forms'
  import { InlineNotification, TextArea } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import { feedbackTypeToKind } from './util.js'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<TextArea> {
    path: string
    notNull?: boolean
    conditional?: boolean
    defaultValue?: string
  }

  export let path: string
  export let notNull = false
  export let conditional = true
  export let defaultValue: string | undefined = notNull ? '' : undefined

  function onInput (setVal: any, deserialize: any) {
    return (e: Event) => {
      const val = (e.target as HTMLTextAreaElement | undefined)?.value ?? ''
      const deserialized = deserialize(val)
      setVal(deserialized)
      dispatch('input', val)
    }
  }
</script>

<Field {path} {notNull} {conditional} {defaultValue} let:invalid let:messages let:value let:setVal let:deserialize={fDeserialize} let:onBlur let:path={fullpath}>
  {@const firstError = messages.filter(m => m.type === 'error').map(m => m.message).slice(0, 1).join('\n')}
  {@const restMsgs = messages.filter(m => m.message !== firstError)}
  <TextArea {...$$restProps} name={fullpath} {value} {invalid} invalidText={firstError} aria-invalid={invalid}
    on:input={onInput(setVal, fDeserialize)} on:change on:focus on:blur={() => { onBlur(); dispatch('blur') }}
  />
  {#each restMsgs as message}
    <InlineNotification lowContrast kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</Field>
