<script lang="ts">
  import { page } from '$app/stores'
</script>
{$page.error?.message ?? 'An error has occurred.'}
