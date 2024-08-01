<script context="module">
  import p from './md_tags/p.svelte'
  import h2 from './md_tags/h2.svelte'
  import h3 from './md_tags/h3.svelte'
  import h4 from './md_tags/h4.svelte'
  import hr from './md_tags/hr.svelte'
  import ul from './md_tags/ul.svelte'
  import ol from './md_tags/ol.svelte'
  export { p, h2, h3, h4, hr, ul, ol }
</script>

<div class="markdownlayout">
  <slot />
</div>

<style>
  /*
   * The code blocks can't be made to use custom components like the others,
   * see https://github.com/pngwn/MDsveX/issues/100
  */

  .markdownlayout :global(pre) {
    background-color: #222;
    padding: .5em 1em;
    color: lightcyan;
    margin: 0 1em 1em 1em;
  }

  .markdownlayout :global(pre .token.tag),
  .markdownlayout :global(pre .token.operator) {
      color: #6ea6ff
  }

  .markdownlayout :global(pre .token.attr-name),
  .markdownlayout :global(pre .token.property) {
      color: #3ddbd9
  }

  .markdownlayout :global(pre .token.function) {
      color: #9ef0f0
  }

  .markdownlayout :global(pre .token.attr-value) {
      color: #d4bbff
  }

  .markdownlayout :global(pre .token.keyword) {
      color: #bb8eff
  }

  .markdownlayout :global(pre .token.punctuation) {
      color: #a8a8a8
  }

  .markdownlayout :global(pre .token.string) {
      color: #fa75a6
  }

  .markdownlayout :global(pre .token.boolean) {
      color: #bb8eff
  }

  .markdownlayout :global(pre .token.number) {
      color: #a7f0ba
  }

  .markdownlayout :global(pre .token.comment) {
      color: #bebebe
  }

</style>
