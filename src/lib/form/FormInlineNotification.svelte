<script lang="ts">
  import { InlineNotification } from 'carbon-components-svelte'
  import { type Feedback, type MessageType } from '@txstate-mws/svelte-forms'
  import { feedbackTypeToKind } from './util.js'
  export let message: Feedback | undefined = undefined
  export let title: string | undefined = undefined
  export let subtitle: string | undefined = undefined
  export let kind: string | undefined = undefined
  export let lowContrast: boolean = false
  export let hideCloseButton: boolean = false
</script>

<InlineNotification
  lowContrast={lowContrast || message?.extra?.lowContrast}
  kind={feedbackTypeToKind(kind ?? message.type)}
  title={title ?? message?.extra?.title}
  subtitle={subtitle ?? message?.message}
  hideCloseButton={hideCloseButton || message?.extra?.hideCloseButton} />
