import { Directive } from '@angular/core';

@Directive({
  selector: '[ngxDialogConfirm]',
  host: {
    'data-ngx-dialog-action': 'confirm',
    class: 'ngx-dialog__action-btn ngx-dialog__action-btn--confirm',
  },
})
export class NgxDialogConfirmDirective {}
