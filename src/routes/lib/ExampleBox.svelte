<script lang="ts">
  export let single = false
</script>


<div class="exampleboxcontainer">
  <div class="examplebox full {single ? '' : 'label'}">
    <slot />
  </div>

  {#if !single}
  <div class="examplebox half light label">
    <slot />
  </div>

  <div class="examplebox half dark label">
    <slot />
  </div>
  {/if}
</div>

<style>
  .exampleboxcontainer {
    margin: 0 1em 1em 1em;
    padding: 1em;
    background-color: #EEE;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: center;
  }
  .examplebox {
    border: 1px dashed #CCC;
    position: relative;
  }
  .examplebox.label {
    margin-top: .8rem;
  }
  .examplebox.label:before {
    font-size: .7rem;
    line-height: 1rem;
    padding: 0 .3rem;
    height: 1rem;
    position: absolute;
    top: -1.05rem;
    right: -1px;
  }

  .examplebox.full {
    width: 100%;
  }
  .examplebox.label.full:before {
    content: 'Full Width, Inherit Background';
  }
  .examplebox.half {
    width: calc(50% - .5em);
  }
  .examplebox.light {
    background-color: #FFF;
  }
  .examplebox.light:before {
    content: 'Half Width, Light Background';
  }
  .examplebox.dark {
    background-color: #222;
  }
  .examplebox.dark:before {
    content: 'Half Width, Dark Background';
  }
</style>
