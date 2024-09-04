<script lang="ts">
  import { Field } from '@txstate-mws/svelte-forms'
  import { InlineNotification, TextInput } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import { feedbackTypeToKind } from './util.js'
  import { FormInlineNotification } from './index.js'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<TextInput> {
    path: string
    number?: boolean
    notNull?: boolean
    conditional?: boolean
    defaultValue?: string
  }

  export let path: string
  export let number = false
  export let notNull = false
  export let conditional = true
  export let defaultValue: string | undefined = notNull ? '' : undefined
  export let required = false

  let harmfulUpdateTimer = 0
  let clearValue: string | undefined
</script>

<Field {path} {notNull} {conditional} {defaultValue} {number} let:invalid let:messages let:value let:setVal let:deserialize let:onBlur let:path={fullpath}>
  {@const firstError = messages.filter(m => m.type === 'error').map(m => m.message).slice(0, 1).join('\n')}
  {@const firstWarn = firstError ? '' : messages.filter(m => m.type === 'warning').map(m => m.message).slice(0, 1).join('\n')}
  {@const restMsgs = messages.filter(m => m.message !== firstError && m.message !== firstWarn)}
  <TextInput {...$$restProps} name={fullpath} value={clearValue ?? value} {invalid} invalidText={firstError} warn={!!firstWarn} warnText={firstWarn} aria-required={required}
    on:input={(e) => {
      clearTimeout(harmfulUpdateTimer)
      const val = String(e.detail ?? '')
      const deserialized = deserialize(val)
      const avoidHarmfulUpdate = typeof deserialized === 'number' && String(deserialized) !== val && /^\d*\.0*/.test(val)
      if (!avoidHarmfulUpdate) {
        if (deserialized == null && val.length) {
          if (clearValue == null) clearValue = ''
          else clearValue += ' '
        } else {
          clearValue = undefined
        }
        setVal(deserialized)
      } else harmfulUpdateTimer = setTimeout(() => setVal(deserialized), 1500)
      dispatch('input', val)
    }} on:change on:focus on:blur={() => { onBlur(); dispatch('blur') }}
  />
  {#each restMsgs as message}
    <FormInlineNotification {message} lowContrast hideCloseButton />
  {/each}
</Field>
