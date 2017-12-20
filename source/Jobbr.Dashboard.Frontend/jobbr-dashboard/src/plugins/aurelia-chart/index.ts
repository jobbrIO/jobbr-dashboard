import { ModelObserver } from './observers/model-observer';
import { PLATFORM } from 'aurelia-pal';

export function configure(aurelia) {
  aurelia.globalResources(
    PLATFORM.moduleName('./elements/chart-element'),
    PLATFORM.moduleName('./attributes/chart-attribute')
  );

  aurelia.container.registerTransient(ModelObserver)
}
