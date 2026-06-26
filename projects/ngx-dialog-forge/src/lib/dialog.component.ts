import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewEncapsulation,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgTemplateOutlet } from '@angular/common';

import { NGX_DIALOG_CONFIG, NgxDialogAction, NgxDialogSize } from './dialog-config';
import { NgxDialogActionsDirective } from './dialog-actions.directive';

@Component({
  selector: 'ngx-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class NgxDialogComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly globalConfig = inject(NGX_DIALOG_CONFIG, { optional: true });

  // Flag prevents re-entrant open.set(false) when we programmatically close the dialog,
  // since dialog.close() fires the native 'close' event synchronously.
  private closingProgrammatically = false;

  readonly open = model(false);
  readonly title = input<string | undefined>(undefined);
  readonly closeButton = input<boolean | undefined>(undefined);
  readonly closeOnBackdrop = input<boolean | undefined>(undefined);
  readonly closeOnEscape = input<boolean | undefined>(undefined);
  readonly size = input<NgxDialogSize>('md');
  readonly actions = input<NgxDialogAction[]>([]);

  readonly action = output<string>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly dialogEl = viewChild<ElementRef<HTMLDialogElement>>('dialogEl');
  protected readonly actionsDirective = contentChild(NgxDialogActionsDirective);

  protected readonly resolvedCloseButton = computed(
    () => this.closeButton() ?? this.globalConfig?.closeButton ?? true,
  );
  protected readonly resolvedCloseOnBackdrop = computed(
    () => this.closeOnBackdrop() ?? this.globalConfig?.closeOnBackdrop ?? true,
  );
  protected readonly resolvedCloseOnEscape = computed(
    () => this.closeOnEscape() ?? this.globalConfig?.closeOnEscape ?? true,
  );

  protected readonly dialogId = `ngx-dialog-${Math.random().toString(36).slice(2, 9)}`;
  protected readonly titleId = `${this.dialogId}-title`;

  protected readonly dialogClasses = computed(() => ({
    'ngx-dialog': true,
    [`ngx-dialog--${this.size()}`]: true,
  }));

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const el = this.dialogEl();
      if (!el) return;
      const dialog = el.nativeElement;
      if (this.open()) {
        if (!dialog.open) {
          dialog.showModal();
          this.opened.emit();
        }
      } else if (dialog.open) {
        this.closingProgrammatically = true;
        dialog.close();
        this.closingProgrammatically = false;
      }
    });
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (!this.resolvedCloseOnBackdrop()) return;
    if (event.target === this.dialogEl()?.nativeElement) {
      this.close();
    }
  }

  protected onCancel(event: Event): void {
    if (!this.resolvedCloseOnEscape()) {
      event.preventDefault();
    }
  }

  protected onNativeClose(): void {
    if (!this.closingProgrammatically) {
      this.open.set(false);
    }
    this.closed.emit();
  }

  protected onFooterClick(event: MouseEvent): void {
    const target = event.target as Element;
    const actionEl = target.closest('[data-ngx-dialog-action]');
    if (!actionEl) return;
    const type = actionEl.getAttribute('data-ngx-dialog-action');
    if (type) {
      event.stopPropagation();
      this.handleAction(type);
    }
  }

  protected close(): void {
    this.open.set(false);
  }

  handleAction(type: string): void {
    this.action.emit(type);
    this.close();
  }
}
