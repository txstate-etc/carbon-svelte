<script lang="ts">
  import { type Feedback, type FormStore, type SubmitResponse } from '@txstate-mws/svelte-forms'
  import { Modal } from 'carbon-components-svelte'
  import { createEventDispatcher, tick } from 'svelte'
  import { beforeNavigate, goto } from '$app/navigation'
  import { unsavedDialogOpen, warnunsaved } from '../stores/warnunsaved.js'
  import Form from './Form.svelte'
  import PanelDialog from '../PanelDialog.svelte'

  type T = $$Generic<Record<string, any>>
  interface $$Events {
    saved: CustomEvent<T>
    cancel: CustomEvent<void>
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
    beforeform: Record<string, never>
    afterform: Record<string, never>
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
  export let unsavedWarning = false
  export let centered = false
  export let disableSaveUntilChanged = false

  let dialogelement: HTMLDialogElement

  let errorText: string | undefined
  function setErrorText (showingInlineErrors: boolean) {
    if (showingInlineErrors) errorText = 'At least one field is missing or incorrect.'
    else errorText = ''
    return ''
  }

  $: resolvedValidate = async (state: T) => open ? await validate?.(state) ?? [] : []

  const dispatch = createEventDispatcher()
  async function onSubmit () {
    if (!store) return
    const resp = await store.submit()
    if (resp.success) {
      dispatch('saved', resp.data)
    } else {
      validationFail()
    }
  }

  function validationFail () {
    dialogelement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    dispatch('validationfail')
  }

  async function resetStore () {
    await tick()
    store?.reset()
  }

  function onCancel () {
    if (unsavedWarning && $store?.hasUnsavedChanges) $unsavedDialogOpen = true
    else dispatch('cancel')
  }

  function onConfirmUnsaved () {
    $unsavedDialogOpen = false
    if (warnunsaved.pendingNavigate) {
      warnunsaved.allowNavigate = true
      void goto(warnunsaved.pendingNavigate.url)
    } else dispatch('cancel')
  }

  function cancelUnsaved () {
    $unsavedDialogOpen = false
  }

  beforeNavigate(({ cancel, type, to }) => {
    if (open && unsavedWarning && $store?.hasUnsavedChanges) {
      if (type !== 'leave' && to != null) {
        $unsavedDialogOpen = true
        warnunsaved.pendingNavigate = to
      }
      if (!warnunsaved.allowNavigate) cancel()
    }
  })
  $: if (!open) void resetStore()
</script>

<PanelDialog bind:dialogelement {open} {title} {cancelText} {submitText} {errorText} {centered} disableSubmit={disableSaveUntilChanged && !$store?.hasUnsavedChanges} on:cancel={onCancel} on:submit={onSubmit}>
  <slot name="beforeform" />
  <Form bind:store class={className} {submit} validate={resolvedValidate} {autocomplete} {name} {preload} hideFallbackMessage on:validationfail={validationFail} on:saved let:messages let:allMessages let:showingInlineErrors let:saved let:valid let:invalid let:validating let:submitting let:data>
    {@const _ = setErrorText(showingInlineErrors)}
    <slot {messages} {saved} {validating} {submitting} {valid} {invalid} {data} {allMessages} {showingInlineErrors} />
    <svelte:fragment slot="submit">&nbsp;</svelte:fragment>
  </Form>
  <slot name="afterform" />
  <Modal bind:open={$unsavedDialogOpen} on:click:button--primary={onConfirmUnsaved} on:click:button--secondary={cancelUnsaved} modalHeading="Unsaved Changes" primaryButtonText="Leave" secondaryButtonText="Stay">
    You have unsaved changes. Are you sure you want to leave?
  </Modal>
</PanelDialog>
