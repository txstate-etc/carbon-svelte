<div class="exampleboxcontainer">
  <div class="examplebox">
    <slot />
  </div>
</div>

<style>
  .exampleboxcontainer {
    margin: 0 1em 1em 1em;
    padding: 1em;
    background-color: #F3F3F3;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: center;
  }
  .examplebox {
    border: 1px dashed #CCC;
    position: relative;
    width: 100%;

    background-image: repeating-linear-gradient(
        45deg,
        #F8F8F8 25%,
        transparent 25%,
        transparent 75%,
        #F8F8F8 75%,
        #F8F8F8
      ),
      repeating-linear-gradient(
        45deg,
        #F8F8F8 25%,
        white 25%,
        white 75%,
        #F8F8F8 75%,
        #F8F8F8
      );
    background-position:
      0 0,
      24px 24px;
    background-size: 16px 16px;
  }
</style>
