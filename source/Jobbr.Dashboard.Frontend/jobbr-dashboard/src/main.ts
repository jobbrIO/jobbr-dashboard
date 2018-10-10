/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner

import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: { wForgottenReturn: false }, longStackTraces: false });

import 'whatwg-fetch';
import 'element-closest';
import { Aurelia } from 'aurelia-framework';
import environment from './environment';
import { PLATFORM } from 'aurelia-pal';

import 'jquery';
import 'popper.js';

import 'bootstrap';

import './styles/styles.scss';

import 'velocity-animate';
import "velocity-animate/velocity.ui";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-animator-css'))
    .plugin(PLATFORM.moduleName('aurelia-animator-velocity'), config => {
      config.enterAnimation = { properties: "transition.slideRightIn", options: { easing: "easeIn", duration: 200 } };
      config.leaveAnimation = { properties: "fadeOut", options: { easing: "easeIn", duration: 0 } };
    })
    .plugin(PLATFORM.moduleName('aurelia-validation'))
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
