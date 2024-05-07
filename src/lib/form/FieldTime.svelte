<script lang="ts">
  import { Field } from '@txstate-mws/svelte-forms'
  import { InlineNotification, SelectItem, TimePicker, TimePickerSelect } from 'carbon-components-svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import { feedbackTypeToKind, to24Hour } from './util.js'

  const dispatch = createEventDispatcher()

  interface $$Props extends ComponentProps<TimePicker> {
    path: string
    conditional?: boolean
    defaultValue?: string
    use12hourclock?: boolean
    /**
     * The user has a certain time zone in mind when they enter a time. It might
     * be an assumed time zone if they are entering data for an object that has a
     * location. For instance, a meeting in Chicago will have a start time in Chicago's
     * time zone, and you and the user both know that.
     *
     * In other circumstances, the time zone the user has in mind is their own time zone.
     * You as the app developer may not know what that is, which could lead to confusion.
     *
     * Set this prop and you will get a different shape added to the form's JSON:
     * `{ time: '17:45', tz: 'America/Chicago' }`. The tz will be the time zone of the user's
     * browser. You can save it on your backend to record the time unambiguously.
     */
    includeTz?: boolean
  }

  export let path: string
  export let conditional = true
  export let defaultValue: string | undefined = undefined
  export let use12hourclock = false
  export let includeTz = false

  let inputelement: HTMLInputElement
  let ampmelement: HTMLSelectElement

  function onChange (setVal: any) {
    return (e: Event) => {
      const time = inputelement.value.trim()
      const ampm = ampmelement.value
      const val = deserialize({ time, ampm })
      if (val != null) {
        setVal(val)
        dispatch('change', val)
      }
    }
  }

  function syncTimeInputWithValue (value: any) {
    inputelement.value = value.time
  }

  function deserialize (val: any) {
    if (val == null) return undefined
    const { time, ampm } = val
    const retTime = use12hourclock ? `${time}${ampm}` : to24Hour(time, ampm)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return includeTz ? { time: retTime, tz } : retTime
  }

  function serialize (val: any): any {
    const actual = val as undefined | string | { time: string, tz: string }
    if (actual == null) return { time: '', ampm: 'am' }
    let hour12: number
    let minute: number
    let ampm: 'am' | 'pm'
    const timeStr = typeof actual === 'string' ? actual : actual.time
    if (use12hourclock) {
      const m = timeStr.match(/^(\d{1,2}):(\d{2})(am|pm)$/)
      if (!m) return { time: '', ampm: 'am' }
      hour12 = Number(m[1])
      minute = Number(m[2])
      ampm = m[3] as 'am' | 'pm'
    } else {
      const [hour, minuteConst] = timeStr.split(':').map(Number)
      ampm = hour >= 12 ? 'pm' : 'am'
      hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
      minute = minuteConst
    }
    return {
      time: `${String(hour12)}:${String(minute).padStart(2, '0')}`,
      ampm
    }
  }
</script>

<Field {path} {conditional} {defaultValue} {serialize} {deserialize} let:invalid let:messages let:value let:setVal let:onBlur let:path={fullpath}>
  {(() => { ampmelement?.setAttribute('aria-invalid', invalid ? 'true' : 'false'); return '' })()}
  {@const firstError = messages.filter(m => m.type === 'error').map(m => m.message).slice(0, 1).join('\n')}
  {@const restMsgs = messages.filter(m => m.message !== firstError)}
  <div on:focusin={() => { dispatch('focus') }} on:focusout={() => { onBlur(); dispatch('blur') }} on:change={onChange(setVal)}>
    <TimePicker {...$$restProps} bind:ref={inputelement}
      value={value?.time ?? ''} name={fullpath}
      {invalid} invalidText={firstError} aria-invalid={invalid}
      on:input={onChange(setVal)}
      on:blur={() => { syncTimeInputWithValue(value) }}
    >
      <TimePickerSelect bind:ref={ampmelement} name="{fullpath}_ampm"
        labelText={$$restProps.labelText} disabled={$$restProps.disabled}
        value={value?.ampm ?? 'am'}
      >
        <SelectItem value="am" text="AM" />
        <SelectItem value="pm" text="PM" />
      </TimePickerSelect>
    </TimePicker>
  </div>
  {#each restMsgs as message}
    <InlineNotification kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</Field>

<!-- TODO: contribute addition of helperText prop, maybe warnText to TimePicker
  contribute on:change to TimePickerSelect -->
