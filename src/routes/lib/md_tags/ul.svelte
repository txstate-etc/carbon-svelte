<ul><slot /></ul>

<style>
  ul {
    margin-left: 3em;
    margin-bottom: 1em;
    list-style-type: disc;
    font-size: var(--cds-body-long-02-font-size, 1rem);
    font-weight: var(--cds-body-long-02-font-weight, 400);
    line-height: var(--cds-body-long-02-line-height, 1.5);
    letter-spacing: var(--cds-body-long-02-letter-spacing, 0);
  }
  ul :global(code) {
    background-color: #EEE;
    padding: 0 .2rem;
  }
  ul :global(a) {
    color: #00F;
  }
  ul :global(a:hover) {
    text-decoration: underline;
  }
  ul :global(ul),
  ul :global(ol) {
    margin-bottom: 0;
  }
</style>
