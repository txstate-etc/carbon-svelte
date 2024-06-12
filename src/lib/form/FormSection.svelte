<script lang="ts">
  import { randomid } from 'txstate-utils'
  const titleId = randomid()
  export let title: string
</script>

<section class="flow" aria-labelledby={titleId}>
  <header id={titleId} class="bg-blue-100 p-[16px] font-black text-lg w-full">{title}</header>
  <slot />
</section>
