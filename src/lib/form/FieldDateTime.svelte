<script lang="ts">
  import { Field } from '@txstate-mws/svelte-forms'
  import { DatePicker, DatePickerInput, InlineNotification, SelectItem, TimePicker, TimePickerSelect } from 'carbon-components-svelte'
  import { DateTime } from 'luxon'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import { isBlank } from 'txstate-utils'
  import { luxonDateTimeDeserialize } from './luxon.js'
  import { feedbackTypeToKind, to24Hour } from './util.js'
  import { FormInlineNotification } from './index.js'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<DatePicker> {
    path: string
    conditional?: boolean
    defaultValue?: Date
    labelText: string
    helperText?: string
    size?: 'sm' | 'xl'
    disabled?: boolean
    hideLabel?: boolean
    /**
     * The default behavior is to record the date and time in the browser's time zone. In some
     * cases, the user might be well aware that they are expected to enter a date in an assumed
     * timezone instead of their own.
     *
     * For instance, a meeting that occurs in Chicago would be given a date in Chicago's time
     * zone, even if the user was in New York while they were entering the event data.
     *
     * In cases like this, you can set the assumed time zone with this prop.
     */
    timeZone?: string
  }

  export let path: string
  export let conditional = true
  export let defaultValue: Date | string | undefined = undefined

  export let labelText: string
  export let helperText: string | undefined = undefined
  export let size: 'sm' | 'xl' | undefined = undefined
  export let disabled = false
  export let hideLabel = false
  export let timeZone: string | undefined = undefined

  let timeinputelement: HTMLInputElement
  let dateinputelement: HTMLInputElement
  let ampmelement: HTMLSelectElement

  function onChange (setVal: any) {
    return () => {
      const dateStr = dateinputelement.value
      if (isBlank(dateStr)) {
        setVal(undefined)
        dispatch('change', undefined)
        return
      }
      const timeStr = timeinputelement.value
      const ampmStr = ampmelement.value
      const dt = deserialize({ dateStr, timeStr, ampmStr })
      if (dt != null) {
        setVal(dt)
        dispatch('change', dt)
      }
    }
  }

  function syncTimeInputWithValue (value: any) {
    timeinputelement.value = value?.timeStr ?? ''
  }

  function deserialize (val: any) {
    const actual: { dateStr: string, timeStr: string, ampmStr: 'am' | 'pm' } = val
    if (isBlank(actual.dateStr) || isBlank(actual.timeStr)) return undefined
    const [month, day, year] = actual.dateStr.split('/')
    const time = to24Hour(actual.timeStr, actual.ampmStr)
    if (isBlank(month) || isBlank(day) || isBlank(year) || isBlank(time)) return undefined
    const dt8601 = `${year}-${month}-${day}T${time}`
    return luxonDateTimeDeserialize(dt8601, timeZone)
  }

  function serialize (val: any): any {
    const ret: { dateStr: string, timeStr: string, ampmStr: 'am' | 'pm' } = { dateStr: '', timeStr: '', ampmStr: 'am' }
    if (val == null) return ret
    let dt = typeof val === 'string' ? DateTime.fromISO(val) : DateTime.fromJSDate(val)
    if (!dt.isValid) return ret
    dt = dt.setZone(timeZone ?? 'local')
    ret.dateStr = dt.toFormat('MM/dd/yyyy')
    ret.timeStr = dt.toFormat('h:mm')
    ret.ampmStr = dt.toFormat('a').toLowerCase() as 'am' | 'pm'
    return ret
  }
</script>

<Field {path} {conditional} {defaultValue} {serialize} {deserialize} let:invalid let:messages let:value let:setVal let:onBlur let:path={fullpath}>
  {(() => { ampmelement?.setAttribute('aria-invalid', invalid ? 'true' : 'false'); return '' })()}
  {@const firstError = messages.filter(m => m.type === 'error').map(m => m.message).slice(0, 1).join('\n')}
  {@const firstWarn = firstError ? '' : messages.filter(m => m.type === 'warning').map(m => m.message).slice(0, 1).join('\n')}
  {@const restMsgs = messages.filter(m => m.message !== firstError && m.message !== firstWarn)}
  <div on:focusin={() => { dispatch('focus') }} on:focusout={() => { onBlur(); dispatch('blur') }} on:change={onChange(setVal)}>
    <DatePicker {...$$restProps} datePickerType="single"
      value={value?.dateStr ?? ''} on:change={onChange(setVal)}
    >
      <DatePickerInput name={fullpath} {labelText} {helperText} {size}
        bind:ref={dateinputelement}
        {invalid} invalidText={firstError}
        warn={!!firstWarn} warnText={firstWarn}
        placeholder="mm/dd/yyyy" {disabled} {hideLabel} aria-invalid={invalid}
        on:blur={() => { onBlur(); dispatch('blur') }}
      />
    </DatePicker>
    <TimePicker bind:ref={timeinputelement} {size} light={$$restProps.light}
      value={value?.timeStr ?? ''} name="{fullpath}_time"
      {invalid} disabled={$$restProps.disabled}
      labelText={$$restProps.labelText} hideLabel
      on:input={onChange(setVal)}
      on:blur={() => { syncTimeInputWithValue(value) }}
    >
      <TimePickerSelect bind:ref={ampmelement} name="{fullpath}_ampm"
        labelText={$$restProps.labelText} disabled={$$restProps.disabled}
        value={value?.ampmStr ?? 'am'}
      >
        <SelectItem value="am" text="AM" />
        <SelectItem value="pm" text="PM" />
      </TimePickerSelect>
    </TimePicker>
  </div>
  {#each restMsgs as message}
    <FormInlineNotification {message} lowContrast hideCloseButton />
  {/each}
</Field>

<!-- TODO: contribute on:focus forward, fix for flatpickr props merge "options" vs "option" -->

<style>
  div {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  :global([data-eq~="450px"]) div {
    flex-wrap: wrap;
  }
  div > :global(*) {
    flex-grow: 0;
  }
  div :global(.bx--time-picker) {
    margin-top: 1.5rem;
  }
  :global([data-eq~="450px"]) div :global(.bx--time-picker) {
    margin-top: 0;
  }
</style>
