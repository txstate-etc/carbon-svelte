<script lang="ts">
  import { Field } from '@txstate-mws/svelte-forms'
  import { InlineNotification, Toggle } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps, afterUpdate } from 'svelte'
  import { randomid } from 'txstate-utils'
  import { feedbackTypeToKind } from './util.js'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<Toggle> {
    path: string
    id?: string
    conditional?: boolean
    defaultValue?: boolean
    helperText?: string
  }

  export let path: string
  export let id = randomid()
  export let conditional = true
  export let defaultValue = false
  export let helperText = ''

  let inputelement: HTMLInputElement
  $: inputelement?.setAttribute('aria-describedby', id + '-helper')

  afterUpdate(() => {
    inputelement = document.getElementById(id) as HTMLInputElement
  })
</script>

<Field {path} {conditional} {defaultValue} let:messages let:value let:invalid let:setVal let:onBlur let:path={fullpath}>
  {(() => { inputelement?.setAttribute('aria-invalid', invalid ? 'true' : 'false'); return '' })()}
  <Toggle {...$$restProps} {id} name={fullpath} toggled={!!value}
    on:toggle={(e) => {
      const val = e.detail?.toggled ?? false
      setVal(val)
      dispatch('toggle', val)
    }} on:change on:focus on:blur={() => { onBlur(); dispatch('blur') }}
  />
  {#if helperText}<div id="{id}-helper" class:bx--form__helper-text={true}>{helperText}</div>{/if}
  {#each messages as message}
    <InlineNotification lowContrast kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</Field>
