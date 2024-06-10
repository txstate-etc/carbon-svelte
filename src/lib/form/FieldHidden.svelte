<script lang="ts">
  import { Field, nullableSerialize, nullableDeserialize, type FormStore, FORM_CONTEXT, FORM_INHERITED_PATH } from '@txstate-mws/svelte-forms'
  import { getContext } from 'svelte'
  import { isNotBlank } from 'txstate-utils'
  export let id: string | undefined = undefined
  export let path: string
  export let value: string | boolean | number = ''
  export let notNull = false
  export let boolean = false
  export let number = false
  export let conditional: boolean | undefined = undefined
  const store = getContext<FormStore>(FORM_CONTEXT)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotBlank).join('.')
  $: void store.setField(finalPath, value)
</script>

<Field {path} {conditional} {boolean} {number} serialize={!notNull ? nullableSerialize : undefined} deserialize={!notNull ? nullableDeserialize : undefined} let:value>
  <input type="hidden" name={path} {value} {id}>
</Field>
