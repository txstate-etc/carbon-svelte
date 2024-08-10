<script lang="ts">
  import { toasts } from '@txstate-mws/svelte-components'
  import { ToastNotification } from 'carbon-components-svelte'
  import { page } from '$app/stores'
</script>

{#if !$page.error}
  <div class="toast-container">
    {#each $toasts as toast}
      <ToastNotification subtitle={toast.message} kind={toast.type ?? 'error'} on:close={() => { toasts.close(toast.id) }} on:mouseenter={() => { toasts.suspend(toast.id) }} on:mouseleave={() => { toasts.resume(toast.id) }}></ToastNotification>
    {/each}
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
