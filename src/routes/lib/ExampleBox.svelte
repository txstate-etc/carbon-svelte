<h4>Examples</h4>

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

  h4 {
    font-weight: bold;
    margin-bottom: .5em;
    margin-left: 1em;
  }
</style>
