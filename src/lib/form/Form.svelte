<script lang="ts">
  import { Form, type Feedback, type FormStore, type SubmitResponse } from '@txstate-mws/svelte-forms'
  import { Button, InlineNotification } from 'carbon-components-svelte'
  import { feedbackTypeToKind } from './util.js'

  type T = $$Generic<any>
  interface $$Events {
    saved: CustomEvent<T>
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
  export let store: FormStore<T> = undefined as any
  export let submit: ((state: T) => Promise<SubmitResponse<T>>) | undefined = undefined
  export let validate: ((state: T) => Promise<Feedback[]>) | undefined = undefined
  export let autocomplete: string | undefined = undefined
  export let name: string | undefined = undefined
  export let preload: T | undefined = undefined
  export let submitText = 'Submit'
</script>

<Form bind:store class="{className} dialog-form" {submit} {validate} {autocomplete} {name} {preload} on:saved let:messages let:allMessages let:showingInlineErrors let:saved let:valid let:invalid let:validating let:submitting let:data>
  <slot {messages} {saved} {validating} {submitting} {valid} {invalid} {data} {allMessages} {showingInlineErrors} />
  {@const errorMessages = messages.filter(m => m.type === 'error' || m.type === 'system')}
  {@const warningMessages = messages.filter(m => m.type === 'warning')}
  {@const successMessages = messages.filter(m => m.type === 'success')}
  {#if errorMessages.length || showingInlineErrors}
    {#each messages as message}
      <InlineNotification kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
    {/each}
    {#if showingInlineErrors && !errorMessages.length}
      <InlineNotification kind="error" subtitle="This form contains validation errors. See inline messages for details." hideCloseButton />
    {/if}
  {/if}
  {#if warningMessages.length}
    {#each warningMessages as message}
      <InlineNotification kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
    {/each}
  {/if}
  {#if successMessages.length}
    {#each successMessages as message}
      <InlineNotification kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
    {/each}
  {/if}
  <slot name="submit" {saved} {validating} {submitting} {valid} {invalid} {allMessages} {showingInlineErrors}>
    <div class='form-submit'>
      <Button type="submit">{submitText}</Button>
    </div>
  </slot>
</Form>

<style>
  .form-submit {
    text-align: right;
  }
</style>
