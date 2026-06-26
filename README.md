# ngx-dialog-forge

A declarative, signals-native Angular dialog library built on the native `<dialog>` element.

[![CI](https://github.com/HoplaGeiss/ngx-dialog-forge/actions/workflows/ci.yml/badge.svg)](https://github.com/HoplaGeiss/ngx-dialog-forge/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/ngx-dialog-forge)](https://www.npmjs.com/package/ngx-dialog-forge)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**[Live demo →](https://hoplageiss.github.io/ngx-dialog-forge/)**

---

## Features

- **Declarative API** — place `<ngx-dialog>` directly in your template, no service calls
- **Signals-first** — two-way binding via `model()`, `input()`, `output()` throughout; OnPush everywhere
- **Native `<dialog>` element** — free focus trapping, backdrop, and `inert` management from the browser
- **Zero runtime dependencies** — no CDK, no third-party packages
- **Flexible actions** — declarative slot (`ng-template ngxDialogActions`) or shorthand `[actions]` input
- **CSS-only theming** — three ready-made themes (Material, Bootstrap, PrimeNG) activated via a single `data-ngx-theme` attribute; no Angular input required
- **Per-instance overrides** — `closeButton`, `closeOnBackdrop`, `closeOnEscape`, and `size` can all be overridden per dialog
- **Global config** — set defaults once with `provideDialog()` in `app.config.ts`
- **SSR-compatible** — all DOM calls are guarded with `isPlatformBrowser`

---

## Requirements

- Angular **22+**

---

## Installation

```bash
pnpm add ngx-dialog-forge
# or
npm install ngx-dialog-forge
```

---

## Setup

### 1. Register global defaults (optional)

```ts
// app.config.ts
import { provideDialog } from 'ngx-dialog-forge';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDialog({
      closeButton: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
    }),
  ],
};
```

### 2. Load a theme

Import one of the provided SCSS partials in your global stylesheet and set `data-ngx-theme` on an ancestor element (typically `<body>`):

```scss
// styles.scss
@use 'ngx-dialog-forge/themes/material';
@use 'ngx-dialog-forge/themes/bootstrap';
@use 'ngx-dialog-forge/themes/primeng';
```

```html
<body data-ngx-theme="material">...</body>
```

Switching the attribute value at runtime changes the active theme instantly — no JavaScript style injection required.

---

## Usage

### Basic dialog

```ts
import { NgxDialogComponent } from 'ngx-dialog-forge';

@Component({
  imports: [NgxDialogComponent],
  template: `
    <button (click)="open.set(true)">Open</button>

    <ngx-dialog [(open)]="open" title="Hello">
      <p>Dialog body content.</p>
    </ngx-dialog>
  `,
})
export class MyComponent {
  open = signal(false);
}
```

---

### Declarative actions slot

Use `ng-template ngxDialogActions` with `ngxDialogCancel` / `ngxDialogConfirm` marker directives. The dialog closes and emits through `(action)` automatically when either is clicked.

```ts
import {
  NgxDialogComponent,
  NgxDialogActionsDirective,
  NgxDialogCancelDirective,
  NgxDialogConfirmDirective,
} from 'ngx-dialog-forge';

@Component({
  imports: [NgxDialogComponent, NgxDialogActionsDirective, NgxDialogCancelDirective, NgxDialogConfirmDirective],
  template: `
    <ngx-dialog [(open)]="open" title="Delete item?" (action)="onAction($event)">
      <p>This action cannot be undone.</p>

      <ng-template ngxDialogActions>
        <button type="button" ngxDialogCancel>Cancel</button>
        <button type="button" ngxDialogConfirm>Delete</button>
      </ng-template>
    </ngx-dialog>
  `,
})
export class MyComponent {
  open = signal(false);

  onAction(type: string): void {
    console.log(type); // 'confirm' | 'cancel'
  }
}
```

---

### Actions via `[actions]` input

Shorthand for simple confirm / cancel flows without a template slot:

```html
<ngx-dialog
  [(open)]="open"
  title="Confirm"
  [actions]="[{ label: 'Cancel', type: 'cancel' }, { label: 'OK', type: 'confirm' }]"
  (action)="onAction($event)">
  <p>Are you sure?</p>
</ngx-dialog>
```

---

### Per-instance overrides

Every option from `provideDialog()` can be overridden per dialog:

```html
<ngx-dialog
  [(open)]="open"
  title="Important"
  [closeOnBackdrop]="false"
  [closeOnEscape]="false"
  [closeButton]="true"
  size="sm">
  <p>Only the X button closes this.</p>
</ngx-dialog>
```

---

## `NgxDialogComponent` API

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `open` | `model<boolean>` | `false` | Two-way binding for the open state |
| `title` | `string` | — | Dialog heading text |
| `closeButton` | `boolean` | from config / `true` | Show the × close button in the header |
| `closeOnBackdrop` | `boolean` | from config / `true` | Close when the backdrop is clicked |
| `closeOnEscape` | `boolean` | from config / `true` | Close on the Escape key |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Max-width preset |
| `actions` | `NgxDialogAction[]` | `[]` | Shorthand action buttons (alternative to the slot) |

### Outputs

| Output | Payload | Description |
|---|---|---|
| `action` | `string` | Emits the action `type` when a button is clicked (`'confirm'`, `'cancel'`, or custom) |
| `opened` | `void` | Fires after `showModal()` is called |
| `closed` | `void` | Fires after the dialog closes (any cause) |

---

## Directives

| Selector | Description |
|---|---|
| `ng-template[ngxDialogActions]` | Marks an `ng-template` as the actions slot |
| `[ngxDialogConfirm]` | Marks a button as the confirm action — emits `'confirm'` and closes the dialog on click |
| `[ngxDialogCancel]` | Marks a button as the cancel action — emits `'cancel'` and closes the dialog on click |

---

## `provideDialog()` options

```ts
interface NgxDialogConfig {
  closeButton?: boolean;      // default: true
  closeOnBackdrop?: boolean;  // default: true
  closeOnEscape?: boolean;    // default: true
}
```

---

## CSS custom properties

Override any of these on `dialog.ngx-dialog` (or a parent) to customise the look without writing a full theme.

| Property | Default | Description |
|---|---|---|
| `--ngx-dialog-bg` | `#ffffff` | Dialog background |
| `--ngx-dialog-border` | `none` | Dialog outline border |
| `--ngx-dialog-border-radius` | `8px` | Corner radius |
| `--ngx-dialog-shadow` | medium drop shadow | Box shadow |
| `--ngx-dialog-border-color` | `rgba(0,0,0,.08)` | Header / footer divider colour |
| `--ngx-dialog-backdrop-color` | `rgba(0,0,0,.5)` | `::backdrop` colour |
| `--ngx-dialog-padding` | `1.25rem 1.5rem` | Fallback padding for header and body |
| `--ngx-dialog-header-bg` | `transparent` | Header background |
| `--ngx-dialog-header-padding` | inherits `--ngx-dialog-padding` | Header padding |
| `--ngx-dialog-title-color` | `inherit` | Title text colour |
| `--ngx-dialog-title-size` | `1.125rem` | Title font size |
| `--ngx-dialog-title-weight` | `600` | Title font weight |
| `--ngx-dialog-body-padding` | inherits `--ngx-dialog-padding` | Body padding |
| `--ngx-dialog-body-color` | `inherit` | Body text colour |
| `--ngx-dialog-footer-bg` | `transparent` | Footer background |
| `--ngx-dialog-footer-padding` | `1rem 1.5rem` | Footer padding |
| `--ngx-dialog-confirm-bg` | `#3b82f6` | Confirm button background |
| `--ngx-dialog-confirm-color` | `#ffffff` | Confirm button text |
| `--ngx-dialog-confirm-border` | matches bg | Confirm button border |
| `--ngx-dialog-confirm-shadow` | `none` | Confirm button box-shadow |
| `--ngx-dialog-cancel-bg` | `transparent` | Cancel button background |
| `--ngx-dialog-cancel-color` | `#374151` | Cancel button text |
| `--ngx-dialog-cancel-border` | `#d1d5db` | Cancel button border |
| `--ngx-dialog-btn-radius` | `6px` | Button corner radius |
| `--ngx-dialog-btn-padding` | `0.5rem 1.25rem` | Button padding |
| `--ngx-dialog-btn-font-size` | `0.875rem` | Button font size |
| `--ngx-dialog-btn-font-weight` | `500` | Button font weight |
| `--ngx-dialog-btn-letter-spacing` | `normal` | Button letter spacing |
| `--ngx-dialog-close-btn-color` | `#6b7280` | × button colour |
| `--ngx-dialog-close-btn-radius` | `4px` | × button corner radius |
| `--ngx-dialog-close-btn-hover-bg` | `rgba(0,0,0,.06)` | × button hover background |
| `--ngx-dialog-close-btn-hover-color` | `#111827` | × button hover colour |
| `--ngx-dialog-focus-ring` | `#3b82f6` | Focus outline colour |
| `--ngx-dialog-width-sm` | `360px` | Width for `size="sm"` |
| `--ngx-dialog-width-md` | `540px` | Width for `size="md"` |
| `--ngx-dialog-width-lg` | `720px` | Width for `size="lg"` |
| `--ngx-dialog-width-xl` | `960px` | Width for `size="xl"` |

---

## Contributing

Pull requests are welcome. For significant changes please open an issue first.

```bash
git clone https://github.com/HoplaGeiss/ngx-dialog-forge.git
cd ngx-dialog-forge
pnpm install
pnpm start   # starts the demo app at localhost:4200
```

---

## License

[MIT](LICENSE)
