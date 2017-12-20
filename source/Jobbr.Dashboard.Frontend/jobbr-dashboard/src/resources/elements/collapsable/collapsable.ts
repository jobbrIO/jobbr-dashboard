import { autoinject } from 'aurelia-framework';
import '../../../../node_modules/bootstrap/js/src/collapse';
import * as $ from 'jquery';

@autoinject
export class Collapsable {

  constructor(private element: Element)   {
  }

  attached() {
    // Design decision: in markup with default css classes?
    // $(this.element.getElementsByClassName('collapse')).collapse();
  }
}
