import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { SignupWidget } from './app/signup-widget';

// Keine Angular-App mit <app-root>: nur ein Injector für die Custom Elements.
createApplication({ providers: [provideBrowserGlobalErrorListeners()] })
  .then((appRef) => {
    // Angular-Komponente in eine Custom-Element-Klasse verpacken ...
    const SignupElement = createCustomElement(SignupWidget, { injector: appRef.injector });
    // ... und beim Browser unter einem Tag-Namen registrieren (Bindestrich ist Pflicht).
    customElements.define('eventhub-signup', SignupElement);
  })
  .catch((err) => console.error(err));
