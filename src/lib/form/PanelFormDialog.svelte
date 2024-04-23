<script lang="ts">
  import { type Feedback, type FormStore, type SubmitResponse } from '@txstate-mws/svelte-forms'
  import Form from './Form.svelte'
  import PanelDialog from '../PanelDialog.svelte'

  type T = $$Generic<any>
  interface $$Events {
    saved: CustomEvent<T>
    cancel: CustomEvent<void>
  }
  interface $$Slots {
    default: {
      messages: Feedback[]
      allMessages: Feedback[]
      saved: boolean
      validating: boolean
      submitting: boolean
      valid: boolean
      invalid: boolean
      showingInlineErrors: boolean
      data: Partial<T>
    }
    submit: {
      saved: boolean
      validating: boolean
      submitting: boolean
      allMessages: Feedback[]
      valid: boolean
      invalid: boolean
      showingInlineErrors: boolean
    }
  }

  let className = ''
  export { className as class }
  export let store: FormStore<T> | undefined = undefined
  export let submit: ((state: T) => Promise<SubmitResponse<T>>) | undefined = undefined
  export let validate: ((state: T) => Promise<Feedback[]>) | undefined = undefined
  export let autocomplete: string | undefined = undefined
  export let name: string | undefined = undefined
  export let preload: T | undefined = undefined
  export let submitText = 'Submit'
  export let cancelText = 'Cancel'
  export let title: string
  export let open = false

  let errorText: string | undefined
  function setErrorText (showingInlineErrors: boolean) {
    if (showingInlineErrors) errorText = 'This form contains validation errors. See inline messages for details.'
    else errorText = ''
    return ''
  }

  $: if (!open) store = undefined
</script>

<PanelDialog {open} {title} {cancelText} {submitText} {errorText} on:cancel>
  <Form bind:store class={className} {submit} {validate} {autocomplete} {name} {preload} hideFallbackMessage on:saved let:messages let:allMessages let:showingInlineErrors let:saved let:valid let:invalid let:validating let:submitting let:data>
    {@const _ = setErrorText(showingInlineErrors)}
    <slot {messages} {saved} {validating} {submitting} {valid} {invalid} {data} {allMessages} {showingInlineErrors} />
    <svelte:fragment slot="submit">&nbsp;</svelte:fragment>
  </Form>
</PanelDialog>
