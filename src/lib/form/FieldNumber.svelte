<script lang="ts">
  import { Field } from '@txstate-mws/svelte-forms'
  import { InlineNotification, NumberInput } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import { feedbackTypeToKind } from './util.js'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<NumberInput> {
    path: string
    notNull?: boolean
    conditional?: boolean
    defaultValue?: number
    labelText?: string
  }

  export let path: string
  export let notNull = false
  export let conditional = true
  export let defaultValue: number | undefined = undefined
  export let labelText: string | undefined = undefined
</script>

<Field {path} {notNull} {conditional} {defaultValue} let:invalid let:messages let:value let:setVal let:deserialize let:onBlur let:path={fullpath}>
  {@const firstError = messages.filter(m => m.type === 'error').map(m => m.message).slice(0, 1).join('\n')}
  {@const firstWarn = firstError ? '' : messages.filter(m => m.type === 'warning').map(m => m.message).slice(0, 1).join('\n')}
  {@const restMsgs = messages.filter(m => m.message !== firstError && m.message !== firstWarn)}
  <NumberInput {...$$restProps} label={labelText ?? $$restProps.label} name={fullpath} {value} {invalid} aria-invalid={true} invalidText={firstError} warn={!!firstWarn} warnText={firstWarn}
    on:input={(e) => {
      const val = e.detail ?? undefined
      setVal(val)
      dispatch('input', val)
    }} on:change on:focus on:blur={() => { onBlur(); dispatch('blur') }}
  />
  {#each restMsgs as message}
    <InlineNotification kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</Field>
