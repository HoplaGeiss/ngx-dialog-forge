import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({ selector: 'ng-template[ngxDialogActions]' })
export class NgxDialogActionsDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
