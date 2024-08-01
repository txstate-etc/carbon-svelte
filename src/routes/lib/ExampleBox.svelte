<div class="exampleboxcontainer">
  <div class="examplebox full">
    <slot />
  </div>

  <div class="examplebox half light">
    <slot />
  </div>

  <div class="examplebox half dark">
    <slot />
  </div>
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
  }
  .examplebox.full {
    width: 100%;
  }
  .examplebox.half {
    width: calc(50% - .5em);
  }

  .examplebox.light {
    background-color: #FFF;
  }

  .examplebox.dark {
    background-color: #222;
  }
</style>
