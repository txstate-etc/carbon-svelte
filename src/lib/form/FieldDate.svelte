<script lang="ts">
  import { Field, dateSerialize } from '@txstate-mws/svelte-forms'
  import { DatePicker, DatePickerInput, InlineNotification } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import { isBlank } from 'txstate-utils'
  import { luxonDateDeserialize } from './luxon.js'
  import { feedbackTypeToKind } from './util.js'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<DatePicker> {
    path: string
    notNull?: boolean
    /**
     * Date-only input can be funky since you cannot record the user's timezone.
     *
     * To solve this problem, this field normally returns a full ISO 8601 datetime
     * set to noon in the browser's timezone.
     *
     * If you prefer to ignore the timezone problem, set this `notNoon` prop and you'll
     * get an ISO8601 date with no timezone, e.g. '2024-03-16'.
     */
    notNoon?: boolean
    conditional?: boolean
    defaultValue?: string
    labelText: string
    helperText?: string
    size?: 'sm' | 'xl'
    placeholder?: string
    disabled?: boolean
    hideLabel?: boolean
    /**
     * The default behavior is to record the date as a datetime with the hour set to
     * noon in the browser's time zone. In some cases, the user might be well aware that
     * they are expected to enter a date in an assumed timezone instead of their own.
     *
     * For instance, a meeting that occurs in Chicago would be given a date in Chicago's time
     * zone, even if the user was in New York while they were entering the event data.
     *
     * In cases like this, you can set the assumed time zone, and you'll get a datetime set
     * to noon in the assumed time zone.
     *
     * This prop does nothing if you set `notNoon` to true.
     */
    timeZone?: string
  }

  export let path: string
  export let notNull = false
  export let notNoon = false
  export let conditional = true
  export let defaultValue: string | undefined = notNull ? '' : undefined

  export let labelText: string
  export let helperText: string | undefined = undefined
  export let size: 'sm' | 'xl' | undefined = undefined
  export let placeholder: string | undefined = 'mm/dd/yyyy'
  export let disabled = false
  export let hideLabel = false
  export let timeZone: string | undefined = undefined

  function onChange (setVal: any) {
    return (e: CustomEvent) => {
      const { dateStr } = e.detail
      const dt = deserialize(dateStr)
      setVal(dt)
      dispatch('change', dt)
    }
  }

  function deserialize (val: string) {
    if (isBlank(val)) return undefined
    const [month, day, year] = val.split('/')
    const dt8601 = `${year}-${month}-${day}`
    return notNoon ? dt8601 : luxonDateDeserialize(dt8601, timeZone)
  }

  function serialize (val: any) {
    if (isBlank(val)) return ''
    const dt = new Date(val)
    const dt8601 = notNoon ? `${String(dt.getUTCFullYear()).padStart(4, '0')}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}` : dateSerialize(val)
    const [year, month, day] = dt8601.split('-')
    return `${month}/${day}/${year}`
  }
</script>

<Field {path} {notNull} {conditional} {defaultValue} {serialize} {deserialize} let:invalid let:messages let:value let:setVal let:onBlur let:path={fullpath}>
  {@const firstError = messages.filter(m => m.type === 'error').map(m => m.message).slice(0, 1).join('\n')}
  {@const firstWarn = firstError ? '' : messages.filter(m => m.type === 'warning').map(m => m.message).slice(0, 1).join('\n')}
  {@const restMsgs = messages.filter(m => m.message !== firstError && m.message !== firstWarn)}
  <DatePicker {...$$restProps} datePickerType="single"
    {value}
    on:change={onChange(setVal)}
  >
    <DatePickerInput name={fullpath} {labelText} {helperText} {size}
      {invalid} invalidText={firstError}
      warn={!!firstWarn} warnText={firstWarn}
      {placeholder} {disabled} {hideLabel}
      on:blur={() => { onBlur(); dispatch('blur') }}
    />
  </DatePicker>
  {#each restMsgs as message}
    <InlineNotification kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</Field>

<!-- TODO: contribute on:focus forward, fix for flatpickr props merge "options" vs "option" -->
