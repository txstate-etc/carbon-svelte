<script lang="ts">
  import { ScreenReaderOnly, modifierKey } from '@txstate-mws/svelte-components'
  import { Store } from '@txstate-mws/svelte-store'
  import { Button } from 'carbon-components-svelte'
  import { OverflowMenuVertical } from 'carbon-icons-svelte'
  import { afterUpdate, tick } from 'svelte'
  import type { ActionItem } from './index.js'

  export let actions: ActionItem[] = []
  export let noPrimaryAction = false
  export let forceOverflow = false
  export let maxButtons = 2
  export let light = false
  export let includeLabels = false
  export let small = false
  export let large = false
  export let describedById: string = ''

  const hasOutside = new Store(false)

  $: buttonSize = (small ? 'small' : (large ? undefined : 'field')) as 'small' | 'field' | undefined
  $: indexedActions = actions.map((a, i) => ({ ...a, idx: i }))
  $: outsideActions = forceOverflow ? [] : (actions.length > maxButtons ? indexedActions.filter(a => !a.disabled).slice(0, maxButtons - 1) : indexedActions)
  $: $hasOutside = outsideActions.length > 0
  $: outsideIndexes = new Set(outsideActions.map(a => a.idx))
  $: overflowActions = indexedActions.filter(a => !outsideIndexes.has(a.idx))
  $: activeAction = $hasOutside ? 0 : -1

  const icon = OverflowMenuVertical
  let overflowOpen = false
  const actionelements: (HTMLButtonElement | HTMLAnchorElement)[] = []
  let overflowButton: HTMLButtonElement

  function activate (idx: number, skipFocusUnlessNoFocus = false) {
    activeAction = idx
    overflowOpen = idx >= 0 && !outsideIndexes.has(idx)
    void tick().then(() => {
      if (!skipFocusUnlessNoFocus || document.activeElement == null) {
        if (idx < 0) overflowButton?.focus()
        else actionelements[idx]?.focus()
      }
    })
  }

  function up () {
    const nextIdx = activeAction - 1
    if ((nextIdx >= 0 || (outsideActions.length === 0 && nextIdx === -1)) && nextIdx !== activeAction) activate(nextIdx)
  }

  function down () {
    const nextIdx = activeAction + 1
    if (nextIdx < actions.length && nextIdx !== activeAction) activate(nextIdx)
  }

  function closeMenu (skipFocusUnlessNoFocus = false) {
    if (outsideActions[0]) activate(outsideActions[0].idx, skipFocusUnlessNoFocus)
    else activate(-1, skipFocusUnlessNoFocus)
  }

  function keyDown (e: KeyboardEvent) {
    if (modifierKey(e)) return
    if (e.key.startsWith('Arrow')) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') up()
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') down()
    else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      closeMenu()
    }
  }

  function overflowClick (e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (overflowOpen) closeMenu()
    else activate(overflowActions[0].idx)
  }


  function focusOut (e: any) {
    if (!e.currentTarget?.contains(e.relatedTarget)) {
      if (overflowOpen) {
        activeAction = outsideActions[0]?.idx ?? -1
        overflowOpen = false
      }
    }
  }

  function actionClick (action: ActionItem & { idx: number }) {
    return (e: MouseEvent) => {
      e.stopPropagation()
      if (action.disabled) e.preventDefault()
      else {
        void action.onClick?.()
        closeMenu(true)
      }
    }
  }

  afterUpdate(() => {
    for (const btn of actionelements) {
      btn?.removeEventListener('keydown', keyDown as any)
      btn?.addEventListener('keydown', keyDown as any)
    }
  })

</script>
{#if actions.length}
  <div role="menu" class="[ relative flex gap-0.5 align-center flex-row-reverse ]" on:focusout={focusOut}>
    {#each outsideActions as action}
      {#if action.icon && !includeLabels}
        <Button size={buttonSize} tabindex={activeAction === action.idx ? '0' : '-1'} aria-disabled={action.disabled} class={action.disabled ? 'bx--btn--disabled' : ''} bind:ref={actionelements[action.idx]} role="menuitem" aria-posinset={action.idx + 1} aria-setsize={actions.length} iconDescription={action.label} icon={action.icon} kind={action.idx === 0 && !noPrimaryAction ? 'primary' : 'secondary'} href={action.href} on:click={actionClick(action)} aria-describedby={describedById} />
      {:else}
        <Button size={buttonSize} tabindex={activeAction === action.idx ? '0' : '-1'} aria-disabled={action.disabled} class="{action.icon ? '' : 'pr-4'} {action.disabled ? 'bx--btn--disabled' : ''}" bind:ref={actionelements[action.idx]} role="menuitem" aria-posinset={action.idx + 1} aria-setsize={actions.length} icon={action.icon} kind={action.idx === 0 && !noPrimaryAction ? 'primary' : 'secondary'} href={action.href} on:click={actionClick(action)} aria-describedby={describedById}>{action.label}</Button>
      {/if}
    {/each}
    {#if overflowActions.length}
      <button type="button" tabindex={$hasOutside ? -1 : activeAction === -1 ? 0 : -1} bind:this={overflowButton} class:bx--overflow-menu={true}
        class:bx--overflow-menu--sm={small} class:bx--overflow-menu--xl={large}
        class:bx--overflow-menu--light={light} class:bx--overflow-menu--open={overflowOpen}
        role="menuitem"
        aria-expanded={overflowOpen} aria-haspopup="menu"
        on:click={overflowClick} on:keydown={keyDown} aria-describedby={describedById}
      >
        <svelte:component this={icon} aria-hidden="true" class="bx--overflow-menu__icon" />
        <ScreenReaderOnly>Show Actions</ScreenReaderOnly>
      </button>
      {#if overflowOpen}
        <div
          class:bx--overflow-menu-options={true}
          class:bx--overflow-menu-options--light={light}
          class:bx--overflow-menu-options--open={true}
        >
          {#each overflowActions as action, i}
            <div class:bx--overflow-menu-options__option={true} class:bx--overflow-menu-options__option--disabled={action.disabled}>
              <svelte:element this={action.href ? 'a' : 'button'}
                bind:this={actionelements[action.idx]}
                class:bx--overflow-menu-options__btn={true}
                href={action.href}
                role="menuitem" aria-posinset={action.idx + 1} aria-setsize={actions.length}
                aria-disabled={action.disabled} aria-describedby={describedById}
                tabindex={activeAction === action.idx ? 0 : -1}
                on:click={actionClick(action)}
              >
                <div class:bx--overflow-menu-options__option-content={true}>
                  {#if action.icon}
                    <svelte:component this={action.icon} class="inline align-text-bottom mr-1" />
                  {/if}
                  {action.label}
                </div>
              </svelte:element>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .bx--overflow-menu-options {
    left: unset;
    right: 0px;
  }
</style>
