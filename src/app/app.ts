import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  NgxDialogActionsDirective,
  NgxDialogCancelDirective,
  NgxDialogComponent,
  NgxDialogConfirmDirective,
} from 'ngx-dialog-forge';

type ThemeOption = 'material' | 'bootstrap' | 'primeng' | 'none';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgxDialogComponent,
    NgxDialogActionsDirective,
    NgxDialogConfirmDirective,
    NgxDialogCancelDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  showBasicDialog = signal(false);
  showActionsSlotDialog = signal(false);
  showActionsInputDialog = signal(false);
  showRestrictedDialog = signal(false);

  lastAction = signal<string | null>(null);
  lastDialogClosed = signal<string | null>(null);

  selectedTheme = signal<ThemeOption>('material');

  protected readonly themes: { label: string; value: ThemeOption }[] = [
    { label: 'Material', value: 'material' },
    { label: 'Bootstrap', value: 'bootstrap' },
    { label: 'PrimeNG', value: 'primeng' },
    { label: 'None', value: 'none' },
  ];

  onAction(type: string): void {
    this.lastAction.set(type);
  }

  onClosed(name: string): void {
    this.lastDialogClosed.set(name);
  }
}
