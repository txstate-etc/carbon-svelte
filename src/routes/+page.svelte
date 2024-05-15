<script lang="ts">
  import { type FormStore, type Feedback, type SubmitResponse } from '@txstate-mws/svelte-forms'
  import {
    PanelFormDialog, FieldCheckboxList, FieldCombobox, FieldDate, FieldDateTime, FieldMore, FieldMultiselect, FieldNumber,
    FieldRadio, FieldRadioTile, FieldSelect, FieldTextArea, FieldTextInput, FieldTime, FieldToggle, Form
  } from '$lib/index.js'
  import { Button } from 'carbon-components-svelte'
    import { Pause } from 'carbon-icons-svelte'

  let store: FormStore
  let dialogOpen = false

  interface FormData {
    selectInput?: string
    selectInputNumber?: number
    fruits: string[]
    combobox?: string
    datetime?: string
  }

  async function onValidate (data: FormData): Promise<Feedback[]> {
    return [
      { path: 'textInput', message: 'That is invalid.', type: 'error' }
    ]
  }

  async function onSubmit (data: FormData) {
    return {} as unknown as SubmitResponse<FormData>
  }
</script>

<!--<button type="button" on:click={() => toasts.add('Oh my!')}>Toast!</button>-->
<Form bind:store submit={onSubmit} validate={onValidate} preload={{ fruits: ['orange'], combobox: 'Dragonfruit', datetime: '2024-03-21T20:34:00.000Z' }} let:data>
  <FieldTextInput path="textInput" labelText='Text Field' required />
  <FieldTextInput path="numberTextInput" labelText='Number in regular TextInput' number helperText="This is really a text field but it accepts numbers." />
  <FieldNumber path="numberInput" labelText='Number in NumberInput' step={0.01} />
  <FieldSelect path="selectInput" labelText="Word Number" items={[
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    { value: 'three', label: 'Three' },
    { value: 'four', label: 'Four', disabled: true }
  ]} />
  <FieldRadio path="radioBoolean" legendText="Does this start undefined?" boolean items={[
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]} />
  <FieldRadio path="selectInputNumber" conditional={data.selectInput === 'three'} legendText="Actual Number" number items={[
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
    { value: 3, label: 'Three' }
  ]} />
  <FieldSelect path="multipliedInputNumber" conditional={(data.selectInputNumber ?? 0) > 0} labelText="Multiplied Number" number items={[
    { value: 1 * (data.selectInputNumber ?? 1), group: 'First Set' },
    { value: 2 * (data.selectInputNumber ?? 1), group: 'First Set' },
    { value: 3 * (data.selectInputNumber ?? 1), group: 'First Set' },
    { value: 4 * (data.selectInputNumber ?? 1), group: 'Second Set' },
    { value: 5 * (data.selectInputNumber ?? 1), group: 'Second Set' },
    { value: 6 * (data.selectInputNumber ?? 1), group: 'Second Set' }
  ]} />
  <FieldMore path="more" helperText="Add as many as you want." reorder>
    <FieldTextInput path="text" notNull />
    <FieldToggle path="show" helperText="Toggle helper" />
  </FieldMore>
  <FieldCheckboxList orientation="horizontal" path="fruits" items={[{ value: 'apple' }, { value: 'orange' }, { value: 'banana' }]} legendText="Fruits" />
  <FieldCheckboxList selectAll orientation="horizontal" path="fruitsSelectAll" items={[{ value: 'apple' }, { value: 'orange' }, { value: 'banana' }]} legendText="Fruits" />
  <FieldCombobox path="combobox" allowFreeEntry />
  <FieldMultiselect path="multiselect" allowFreeEntry />
  <FieldRadioTile path="radiotile" items={[{ value: 'apple' }, { value: 'orange' }, { value: 'banana' }]} legendText="Fruits in Tiles" />
  <div class="sidebyside">
    <FieldDate path="date" labelText="Date only" timeZone="America/Chicago" />
    <FieldTime path="time" labelText="Time only" use12hourclock includeTz />
  </div>
  <FieldDateTime path="datetime" labelText="Date and Time" />
  <FieldTextArea path="textarea" labelText="Text Area" />
  <br>
  TODO: FieldDateRange, FieldDateTimeRange, FieldPassword,
  FieldUpload, FieldDropdown, FieldCKEditor, FieldCode
  <br>
  <pre>
{JSON.stringify(data, null, 2)}
  </pre>
</Form>
<Button on:click={() => { dialogOpen = true }}>Open Dialog</Button>
<PanelFormDialog open={dialogOpen} on:cancel={() => { dialogOpen = false }} title="Test Dialog" validate={async (data) => [{ type: 'error', path: 'textinput', message: 'Testing errors.' }]} submit={async data => ({ success: false, messages: [{ type: 'error', path: 'textinput', message: 'Testing errors.' }], data })}>
  <FieldTextInput path="textinput" labelText="Text Input in Dialog" />
  <FieldTextInput path="anotherinput" labelText="Another Input in Dialog" />
  <FieldCheckboxList path="checklist" items={[{ value: 'apple' }, { value: 'orange' }, { value: 'banana' }]} />
</PanelFormDialog>
<style>
  .sidebyside {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
  }
  .sidebyside > :global(*) {
    flex-grow: 0 !important;
  }
</style>
