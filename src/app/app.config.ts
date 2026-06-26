import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideDialog } from 'ngx-dialog-forge';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideDialog({
      closeButton: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
    }),
  ],
};
