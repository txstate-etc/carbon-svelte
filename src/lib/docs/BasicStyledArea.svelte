<div class="basicstyledarea">
  <slot />
</div>

<style>
  .basicstyledarea :global(h2) {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: .5em;
  }
  .basicstyledarea :global(h3) {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: .5em;
  }
  .basicstyledarea :global(h4) {
    font-weight: bold;
    margin-bottom: .5em;
  }
  .basicstyledarea :global(code) {
    background-color: #EEE;
    padding: 0 .2em;
  }
  .basicstyledarea :global(pre code) {
    background-color: inherit;
  }
  .basicstyledarea :global(p) {
    margin-bottom: 1em;
  }
  .basicstyledarea :global(pre) {
    background-color: #222;
    padding: .5em 1em;
    color: lightcyan;
    margin-bottom: 1em;
  }
  .basicstyledarea :global(hr) {
    margin: 1em;
  }
  .basicstyledarea :global(a) {
    color: #00F;
  }
  .basicstyledarea :global(a:hover) {
    text-decoration: underline;
  }
  .basicstyledarea :global(ul),
  .basicstyledarea :global(ol) {
    margin-left: 3em;
    margin-bottom: 1em;
  }
  .basicstyledarea :global(ul) {
    list-style-type: disc;
  }
  .basicstyledarea {
    margin: 0 1em;
  }



  .basicstyledarea :global(.token.tag),
  .basicstyledarea :global(.token.operator) {
      color: #6ea6ff
  }

  .basicstyledarea :global(.token.attr-name),
  .basicstyledarea :global(.token.property) {
      color: #3ddbd9
  }

  .basicstyledarea :global(.token.function) {
      color: #9ef0f0
  }

  .basicstyledarea :global(.token.token.language-javascript),
  .basicstyledarea :global(.token.attr-value) {
      color: #d4bbff
  }

  .basicstyledarea :global(.token.keyword) {
      color: #bb8eff
  }

  .basicstyledarea :global(.token.punctuation) {
      color: #a8a8a8
  }

  .basicstyledarea :global(.token.script .token.language-javascript) {
      color: #3ddbd9
  }

  .basicstyledarea :global(.token.string) {
      color: #fa75a6
  }

  .basicstyledarea :global(.token.boolean) {
      color: #bb8eff
  }

  .basicstyledarea :global(.token.number) {
      color: #a7f0ba
  }

  .basicstyledarea :global(.token.comment) {
      color: #bebebe
  }

</style>
