<script lang="ts">
  import { Field } from '@txstate-mws/svelte-forms'
  import { InlineNotification, Checkbox } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import { randomid } from 'txstate-utils'
  import { feedbackTypeToKind } from './util.js'
  import FormInlineNotification from './FormInlineNotification.svelte'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<Checkbox> {
    path: string
    id?: string
    conditional?: boolean
    defaultValue?: boolean
    helperText?: string
  }

  export let path: string
  export let id = randomid()
  export let conditional = true
  export let defaultValue: boolean | undefined = $$restProps.indeterminate ? undefined : false
  export let helperText = ''

  let inputelement: HTMLInputElement
  $: inputelement?.setAttribute('aria-describedby', id)
</script>

<Field {path} {conditional} {defaultValue} let:messages let:value let:invalid let:setVal let:onBlur let:path={fullpath}>
  <Checkbox {...$$restProps} {id} bind:ref={inputelement} name={fullpath} checked={value} aria-invalid={invalid}
    on:check={(e) => {
      const val = e.detail
      setVal(val)
      dispatch('check', val)
    }} on:change on:blur={() => { onBlur(); dispatch('blur') }} on:focus
  />
  {#if helperText}<div id="{id}-helper" class:bx--form__helper-text={true}>{helperText}</div>{/if}
  {#each messages as message}
    <FormInlineNotification {message} hideCloseButton/>
  {/each}
</Field>
