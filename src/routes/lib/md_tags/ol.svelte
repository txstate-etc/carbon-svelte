<ol><slot /></ol>

<style>
  ol {
    margin-left: 3em;
    margin-bottom: 1em;
    list-style-type: disc;
    font-size: var(--cds-body-long-02-font-size, 1rem);
    font-weight: var(--cds-body-long-02-font-weight, 400);
    line-height: var(--cds-body-long-02-line-height, 1.5);
    letter-spacing: var(--cds-body-long-02-letter-spacing, 0);
  }
  ol :global(code) {
    background-color: #EEE;
    padding: 0 .2rem;
  }
  ol :global(a) {
    color: #00F;
  }
  ol :global(a:hover) {
    text-decoration: underline;
  }
  ol :global(ul),
  ol :global(ol) {
    margin-bottom: 0;
  }
</style>
