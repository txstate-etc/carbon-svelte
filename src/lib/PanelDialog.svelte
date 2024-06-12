<script lang="ts">
  import { Button, InlineNotification } from 'carbon-components-svelte'
  import Close from 'carbon-icons-svelte/lib/Close.svelte'
  import { createEventDispatcher } from 'svelte'
  import { randomid } from 'txstate-utils'

  export let title: string
  export let open = false
  export let cancelText = 'Cancel'
  export let submitText = 'Submit'
  export let errorText = ''
  export let dialogelement: HTMLDialogElement | undefined = undefined

  let closebutton: HTMLButtonElement | undefined
  let closing = false
  const dispatch = createEventDispatcher()

  function cancel () {
    dispatch('cancel')
  }
  function submit () {
    dispatch('submit')
  }
  function onKeyDown (e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    }
  }

  function openModal () {
    if (!dialogelement!.open) dialogelement!.showModal()
  }

  function closeModal () {
    if (!dialogelement!.open || closing) return
    closing = true

    dialogelement!.addEventListener(
      'animationend',
      () => {
        dialogelement!.close()
        closing = false
      },
      { once: true }
    )
  }

  const titleId = randomid()
  const errorId = randomid()
  $: if (dialogelement) open ? openModal() : closeModal()
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialogelement} class:closing
  class="tcbs-dialog shadow bg-neutral-200-background fixed m-0 ml-auto top-0 right-0 h-full transition-transform transform-none"
  on:keydown={onKeyDown}
>
  {#if open}
    <section aria-labelledby={titleId}>
      <header class="[ flex items-center justify-between py-[8px] px-[16px] ]">
        <div id={titleId} class="[ font-bold mr-auto ]">{title}</div>
        <Button bind:ref={closebutton} on:click={cancel} kind="secondary" iconDescription="Close Dialog" icon={Close} tooltipPosition="left" aria-describedby={titleId} size="small" />
      </header>
      <div class="content [ p-[16px] flow ]" class:has-error={!!errorText}>
        <slot />
      </div>
      {#if errorText}
        <div id={errorId} class="error-text [ p-[8px] ]"><InlineNotification subtitle={errorText} lowContrast hideCloseButton /></div>
      {/if}
      <footer class="[ flex flex-wrap justify-end items-center ]">
        <slot name="buttons">
          <Button kind="secondary" size="small" class="ml-[8px]" on:click={cancel} aria-describedby={titleId}>{cancelText}</Button>
          <Button size="small" class="ml-[8px]" on:click={submit} aria-describedby="{errorId} {titleId}">{submitText}</Button>
        </slot>
      </footer>
    </section>
  {/if}
</dialog>

<style lang="css">
  dialog {
    width: min(32rem, 100%);
    max-width: 100%;
    max-height: 100%;
  }
  section {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  section .content {
    overflow-y: auto;
    flex-grow: 1;
  }
  section .content.has-error {
    padding-bottom: calc(2.5rem + 1.5 * var(--cds-body-short-01-font-size, 0.875rem));
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeIn 150ms ease-in-out;
  }

  dialog[open] {
    animation: slideInFromRight 150ms ease-in-out;
  }

  dialog.closing {
    animation: slideOutToRight 150ms ease-in-out;
  }
  dialog.closing::backdrop {
    animation: fadeOut 150ms forwards;
  }

  @keyframes slideInFromRight {
    from {
      transform: translateX(100%);
    }
  }

  @keyframes slideOutToRight {
    to {
      transform: translateX(100%);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      filter: brightness(1) blur(20px)
    }
    10% {
      opacity: 1;
      filter: brightness(0.5) blur(10px)
    }
    100% {
      opacity: 1;
      filter: brightness(1) blur(0)
    }
  }

  @keyframes fadeOut {
    100% {
      opacity: 0;
      filter: brightness(1) blur(20px)
    }
    10% {
      opacity: 1;
      filter: brightness(0.5) blur(10px)
    }
    0% {
      opacity: 1;
      filter: brightness(1) blur(0)
    }
  }

  header, footer {
    background-color: var(--cds-layer-accent);
  }
  .error-text {
    position: absolute;
    right: 0;
    bottom: calc(2rem + 16px);
    color: var(--cds-text-error);
    opacity: 0.8;
  }
  .error-text :global(.bx--inline-notification) {
    margin: 0;
    max-width: 100%;
  }

  footer {
    padding: 8px;
  }

  :global(body:has(dialog.tcbs-dialog[open])) {
    overflow: hidden;
  }
</style>
