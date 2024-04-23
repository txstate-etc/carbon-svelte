<script lang="ts">
  import { Button } from 'carbon-components-svelte'
  import Close from 'carbon-icons-svelte/lib/Close.svelte'
  import { createEventDispatcher, tick } from 'svelte'
  import { randomid } from 'txstate-utils'

  export let title: string
  export let open = false
  export let cancelText = 'Cancel'
  export let submitText = 'Submit'
  export let errorText = ''

  let dialogelement: HTMLDialogElement | undefined
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
    if (!dialogelement!.open) {
      void tick().then(() => {
        dialogelement!.showModal()
      })
    }
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
      <header class="flex items-center justify-between py-2 px-4">
        <div id={titleId} class="font-bold mr-auto">{title}</div>
        <Button bind:ref={closebutton} on:click={cancel} kind="secondary" iconDescription="Close Dialog" icon={Close} tooltipPosition="left" aria-describedby={titleId} size="small" />
      </header>
      <div class="content p-4 flow">
        <slot />
      </div>
      <footer class="flex justify-end items-center p-2">
        <div id={errorId} class="error-text flex-grow">{errorText}</div>
        <slot name="buttons">
          <Button kind="secondary" size="small" class="ml-2" on:click={cancel} aria-describedby={titleId}>{cancelText}</Button>
          <Button size="small" class="ml-2" on:click={submit} aria-describedby="{errorId} {titleId}">{submitText}</Button>
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
    color: var(--cds-text-error);
  }

  :global(body:has(dialog.tcbs-dialog[open])) {
    overflow: hidden;
  }
</style>
