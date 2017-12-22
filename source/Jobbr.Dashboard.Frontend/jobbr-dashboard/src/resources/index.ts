import { PLATFORM } from 'aurelia-framework';
import { FrameworkConfiguration } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources(PLATFORM.moduleName('./value-converters/jsonValueConverter'));
  config.globalResources(PLATFORM.moduleName('./value-converters/dateValueConverter'));
}
