<script lang="ts">
  import { Form, type Feedback, type FormStore, type SubmitResponse } from '@txstate-mws/svelte-forms'
  import { Button, InlineNotification, Modal } from 'carbon-components-svelte'
  import { Save } from 'carbon-icons-svelte'
  import type { SvelteComponent } from 'svelte'
  import { beforeNavigate, goto } from '$app/navigation'
  import { unsavedDialogOpen, warnunsaved } from '../stores/warnunsaved.js'
  import { feedbackTypeToKind } from './util.js'

  type T = $$Generic<Record<string, any>>
  interface $$Events {
    saved: CustomEvent<T>
    validationfail: CustomEvent
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
      hasUnsavedChanges: boolean
    }
    submit: {
      saved: boolean
      validating: boolean
      submitting: boolean
      allMessages: Feedback[]
      valid: boolean
      invalid: boolean
      showingInlineErrors: boolean
      hasUnsavedChanges: boolean
      saveDisabled: boolean
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
  export let hideFallbackMessage = false
  export let submitIcon: typeof SvelteComponent<any> = Save
  export let unsavedWarning = false
  export let disableSaveUntilChanged = false

  let formelement: HTMLFormElement
  function validationFail () {
    formelement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }

  function onConfirmUnsaved () {
    $unsavedDialogOpen = false
    if (warnunsaved.pendingNavigate) {
      warnunsaved.allowNavigate = true
      const url = warnunsaved.pendingNavigate.url
      delete warnunsaved.pendingNavigate
      void goto(url)
    }
  }

  function cancelUnsaved () {
    $unsavedDialogOpen = false
  }

  beforeNavigate(({ cancel, type, to }) => {
    if (unsavedWarning && $store.hasUnsavedChanges) {
      if (!warnunsaved.allowNavigate && type !== 'leave' && to != null) {
        $unsavedDialogOpen = true
        warnunsaved.pendingNavigate = to
        cancel()
      }
    }
  })
</script>

<Form bind:store bind:formelement class="{className} flow" {submit} {validate} {autocomplete} {name} {preload} on:saved on:validationfail on:validationfail={validationFail} let:messages let:allMessages let:showingInlineErrors let:saved let:valid let:invalid let:validating let:submitting let:data let:hasUnsavedChanges>
  <slot {messages} {saved} {validating} {submitting} {valid} {invalid} {data} {allMessages} {showingInlineErrors} {hasUnsavedChanges} />
  {@const errorMessages = messages.filter(m => m.type === 'error' || m.type === 'system')}
  {@const warningMessages = messages.filter(m => m.type === 'warning')}
  {@const successMessages = messages.filter(m => m.type === 'success')}
  {#if errorMessages.length || showingInlineErrors}
    {#each messages as message}
      <InlineNotification lowContrast kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
    {/each}
    {#if !hideFallbackMessage && showingInlineErrors && !errorMessages.length}
      <InlineNotification lowContrast kind="error" subtitle="This form contains errors. See inline messages for details." hideCloseButton />
    {/if}
  {/if}
  {#if warningMessages.length}
    {#each warningMessages as message}
      <InlineNotification lowContrast kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
    {/each}
  {/if}
  {#if successMessages.length}
    {#each successMessages as message}
      <InlineNotification lowContrast kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
    {/each}
  {/if}
  <slot name="submit" {saved} {validating} {submitting} {valid} {invalid} {allMessages} {showingInlineErrors} {hasUnsavedChanges} saveDisabled={disableSaveUntilChanged && !hasUnsavedChanges}>
    <div class='form-submit'>
      <Button icon={submitIcon} type="submit" disabled={disableSaveUntilChanged && !hasUnsavedChanges}>{submitText}</Button>
    </div>
  </slot>
</Form>
<Modal bind:open={$unsavedDialogOpen} on:click:button--primary={onConfirmUnsaved} on:click:button--secondary={cancelUnsaved} modalHeading="Unsaved Changes" primaryButtonText="Leave" secondaryButtonText="Stay">
  You have unsaved changes. Are you sure you want to leave?
</Modal>

<style>
  .form-submit {
    text-align: right;
  }
</style>
