<script lang="ts">
  import { Field } from '@txstate-mws/svelte-forms'
  import { InlineNotification, Slider } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import { feedbackTypeToKind } from './util.js'
  import FormInlineNotification from './FormInlineNotification.svelte'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<Slider> {
    path: string
    notNull?: boolean
    conditional?: boolean
    defaultValue?: number
  }

  export let path: string
  export let notNull = false
  export let conditional = true
  export let defaultValue: number | undefined = undefined
</script>

<Field {path} {notNull} {conditional} {defaultValue} let:invalid let:messages let:value let:setVal let:deserialize let:onBlur let:path={fullpath}>
  <div on:focusin={() => dispatch('focus')} on:focusout={() => { onBlur(); dispatch('blur') }}>
    <Slider {...$$restProps} name={fullpath} {value} {invalid} aria-invalid={invalid}
      on:input={(e) => {
        const val = e.detail ?? undefined
        setVal(val)
        dispatch('input', val)
      }} on:change
    />
  </div>
  {#each messages as message}
    <FormInlineNotification {message} lowContrast hideCloseButton />
  {/each}
</Field>

<!-- TODO: contribute to add invalidText and helperText to Slider, maybe forward blur and focus too -->
