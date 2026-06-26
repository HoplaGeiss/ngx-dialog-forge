import { InjectionToken, Provider } from '@angular/core';

export type NgxDialogSize = 'sm' | 'md' | 'lg' | 'xl';

export interface NgxDialogAction {
  label: string;
  type: string;
}

export interface NgxDialogConfig {
  closeButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export const NGX_DIALOG_CONFIG = new InjectionToken<NgxDialogConfig>('NGX_DIALOG_CONFIG');

export function provideDialog(config: NgxDialogConfig = {}): Provider {
  return { provide: NGX_DIALOG_CONFIG, useValue: config };
}
