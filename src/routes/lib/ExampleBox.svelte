<div class="examplebox">
  <slot />
</div>

<div class="examplebox small">
  <slot />
</div>

<style>
  .examplebox {
    border: 1px dashed black;
    margin: 0 1em 1em 1em;
  }

  .examplebox.small {
    max-width: 400px;
    margin: auto;
  }
</style>
