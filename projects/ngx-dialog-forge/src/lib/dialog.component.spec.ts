import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { NgxDialogComponent } from './dialog.component';
import { NgxDialogActionsDirective } from './dialog-actions.directive';
import { NgxDialogCancelDirective } from './dialog-cancel.directive';
import { NgxDialogConfirmDirective } from './dialog-confirm.directive';
import { NgxDialogAction, provideDialog } from './dialog-config';

// jsdom does not implement showModal/close — define minimal stubs directly on
// the prototype so the component's effect() can open and close the <dialog>.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

function createDialog(inputs: {
  open?: boolean;
  title?: string;
  closeButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  actions?: NgxDialogAction[];
} = {}) {
  const fixture = TestBed.createComponent(NgxDialogComponent);
  for (const [key, value] of Object.entries(inputs)) {
    if (value !== undefined) fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  const host = fixture.nativeElement as HTMLElement;
  return {
    fixture,
    component: fixture.componentInstance,
    dialog: host.querySelector('dialog')!,
    host,
  };
}

describe('NgxDialogComponent', () => {
  describe('open state', () => {
    it('starts hidden', () => {
      const { dialog } = createDialog();
      expect(dialog.hasAttribute('open')).toBe(false);
    });

    it('shows when open is true', () => {
      const { dialog } = createDialog({ open: true });
      expect(dialog.hasAttribute('open')).toBe(true);
    });

    it('hides when open changes to false', () => {
      const { fixture, dialog } = createDialog({ open: true });
      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();
      expect(dialog.hasAttribute('open')).toBe(false);
    });

  });

  describe('title', () => {
    it('renders the title text', () => {
      const { host } = createDialog({ open: true, title: 'Delete item?' });
      expect(host.querySelector('.ngx-dialog__title')?.textContent?.trim()).toBe('Delete item?');
    });

    it('omits the title element when no title is given', () => {
      const { host } = createDialog({ open: true });
      expect(host.querySelector('.ngx-dialog__title')).toBeNull();
    });
  });

  describe('close button', () => {
    it('is visible by default', () => {
      const { host } = createDialog({ open: true });
      expect(host.querySelector('.ngx-dialog__close-btn')).not.toBeNull();
    });

    it('is hidden when closeButton is false', () => {
      const { host } = createDialog({ open: true, closeButton: false });
      expect(host.querySelector('.ngx-dialog__close-btn')).toBeNull();
    });

    it('closes the dialog when clicked', () => {
      const { fixture, host, dialog } = createDialog({ open: true });
      host.querySelector<HTMLButtonElement>('.ngx-dialog__close-btn')!.click();
      fixture.detectChanges();
      expect(dialog.hasAttribute('open')).toBe(false);
    });
  });

  describe('backdrop click', () => {
    it('closes when the backdrop (dialog element) is clicked', () => {
      const { fixture, dialog } = createDialog({ open: true });
      dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();
      expect(dialog.hasAttribute('open')).toBe(false);
    });

    it('stays open when closeOnBackdrop is false', () => {
      const { fixture, dialog } = createDialog({ open: true, closeOnBackdrop: false });
      dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();
      expect(dialog.hasAttribute('open')).toBe(true);
    });
  });

  describe('Escape key', () => {
    it('allows Escape to close by not preventing the cancel event', () => {
      const { dialog } = createDialog({ open: true, closeOnEscape: true });
      const event = new Event('cancel', { cancelable: true });
      dialog.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('blocks Escape when closeOnEscape is false', () => {
      const { dialog } = createDialog({ open: true, closeOnEscape: false });
      const event = new Event('cancel', { cancelable: true });
      dialog.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('[actions] input', () => {
    const actions: NgxDialogAction[] = [
      { label: 'Cancel', type: 'cancel' },
      { label: 'Delete', type: 'confirm' },
    ];

    it('renders the action buttons', () => {
      const { host } = createDialog({ open: true, actions });
      const buttons = host.querySelectorAll<HTMLButtonElement>('.ngx-dialog__action-btn');
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent?.trim()).toBe('Cancel');
      expect(buttons[1].textContent?.trim()).toBe('Delete');
    });

    it('emits the action type when a button is clicked', () => {
      const { fixture, host } = createDialog({ open: true, actions });
      const emitted: string[] = [];
      fixture.componentInstance.action.subscribe((type: string) => emitted.push(type));
      host.querySelector<HTMLButtonElement>('[data-ngx-dialog-action="confirm"]')!.click();
      expect(emitted).toEqual(['confirm']);
    });

    it('closes the dialog after an action is taken', () => {
      const { fixture, host, dialog } = createDialog({ open: true, actions });
      host.querySelector<HTMLButtonElement>('[data-ngx-dialog-action="confirm"]')!.click();
      fixture.detectChanges();
      expect(dialog.hasAttribute('open')).toBe(false);
    });

    it('shows no footer when actions array is empty', () => {
      const { host } = createDialog({ open: true, actions: [] });
      expect(host.querySelector('.ngx-dialog__footer')).toBeNull();
    });
  });

  describe('ngxDialogActions slot', () => {
    @Component({
      template: `
        <ngx-dialog [(open)]="open" title="Confirm">
          <ng-template ngxDialogActions>
            <button type="button" ngxDialogCancel>No</button>
            <button type="button" ngxDialogConfirm>Yes</button>
          </ng-template>
        </ngx-dialog>
      `,
      imports: [NgxDialogComponent, NgxDialogActionsDirective, NgxDialogCancelDirective, NgxDialogConfirmDirective],
    })
    class HostWithSlot {
      open = true;
    }

    it('renders the projected buttons with action styles', () => {
      const fixture = TestBed.createComponent(HostWithSlot);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const buttons = el.querySelectorAll<HTMLButtonElement>('.ngx-dialog__action-btn');
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent?.trim()).toBe('No');
      expect(buttons[1].textContent?.trim()).toBe('Yes');
    });

    it('closes the dialog when a slotted action button is clicked', () => {
      const fixture = TestBed.createComponent(HostWithSlot);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      el.querySelector<HTMLButtonElement>('[data-ngx-dialog-action="confirm"]')!.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.open).toBe(false);
    });
  });

  describe('global config via provideDialog()', () => {
    describe('when closeButton is globally false', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [provideDialog({ closeButton: false })],
        });
      });

      it('hides the close button', () => {
        const { host } = createDialog({ open: true });
        expect(host.querySelector('.ngx-dialog__close-btn')).toBeNull();
      });

      it('per-instance closeButton=true overrides the global setting', () => {
        const { host } = createDialog({ open: true, closeButton: true });
        expect(host.querySelector('.ngx-dialog__close-btn')).not.toBeNull();
      });
    });
  });
});
