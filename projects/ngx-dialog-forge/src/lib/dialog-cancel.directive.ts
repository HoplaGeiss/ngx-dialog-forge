import { Directive } from '@angular/core';

@Directive({
  selector: '[ngxDialogCancel]',
  host: {
    'data-ngx-dialog-action': 'cancel',
    class: 'ngx-dialog__action-btn ngx-dialog__action-btn--cancel',
  },
})
export class NgxDialogCancelDirective {}
