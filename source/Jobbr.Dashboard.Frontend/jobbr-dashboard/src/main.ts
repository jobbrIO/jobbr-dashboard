/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner
import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import {PLATFORM} from 'aurelia-pal';
import * as Bluebird from 'bluebird';
import 'jquery';
import 'popper.js';

import '../node_modules/bootstrap/js/src/button';
import '../node_modules/bootstrap/js/src/dropdown';
import '../node_modules/bootstrap/js/src/collapse';
import '../node_modules/bootstrap/js/src/popover';

import '../static/styles/bootstrap.scss'
import '../static/styles/layout.scss';
import '../static/styles/text.scss';
import '../static/styles/box.scss';
import '../static/styles/list.scss';
import '../static/styles/checkbox.scss';
import '../static/styles/table.scss';
import '../static/styles/highlightjs.scss';

Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .feature(PLATFORM.moduleName('plugins/aurelia-chart/index'))
    .plugin(PLATFORM.moduleName('aurelia-animator-css'))
    .plugin(PLATFORM.moduleName('aurelia-bootstrap'), config => config.options.version = 4); // bootstrap v4

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
