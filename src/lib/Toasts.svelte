<script lang="ts">
  import { toasts } from '@txstate-mws/svelte-components'
  import { ToastNotification } from 'carbon-components-svelte'
</script>

<div class="toast-container">
  {#each $toasts as toast}
    <ToastNotification subtitle={toast.message} kind={toast.type ?? 'error'} on:close={() => { toasts.close(toast.id) }}></ToastNotification>
  {/each}
</div>
<slot />

<style>
  .toast-container {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
