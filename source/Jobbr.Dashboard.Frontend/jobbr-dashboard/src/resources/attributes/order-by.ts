import { autoinject, bindable, observable, LogManager, bindingMode } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject()
export class OrderByCustomAttribute {
  @bindable field: string;
  @bindable @observable() order: string;

  private log: any;

  constructor(private element: Element, private router: Router) {
    this.log = LogManager.getLogger('orderByCustomAttribute');
  }

  attached() {
    this.element.addEventListener('click', this.clicked);
  }

  clicked = () => {
    this.updateSort(this.order, this.field);
  }

  private orderChanged(newValue: string, oldValue: string) {
    this.updateCss(this.order, this.element, this.field);

    let currentParams = this.router.currentInstruction.queryParams;
    currentParams.orderBy = this.order;
  }

  public updateSort(orderBy: string, field) {
    /* sort order cycle: undefined --> field --> -field --> undefined */

    /* if orderBy is null or undefined, we set it to the current field */
    if (orderBy === undefined || orderBy === null) {
      orderBy = field;
    } else {

      /* let's first extract the sort order and clean the orderBy field */
      var descending = orderBy.indexOf('-') === 0;

      orderBy = this.trimStart(orderBy, '-');

      if (orderBy !== field) {
        /* if orderBy has the value of another field, we set it to the current field */
        orderBy = field;
      } else if (descending) {
        /* Here we know that orderBy has the value of our field.
           If the sort order is descending, we cycle to the next state,
           which is resetting the orderBy to undefined
         */
        orderBy = undefined;
      } else {
        /* Here we know that orderBy has the value of our field and that the sort order was ascending.
           Therefore we set the new orderBy to descending
         */
        orderBy = '-' + field;
      }
    }

    this.order = orderBy;
  }

  private trimStart(target: string, trimText: string) {
    if (target.startsWith(trimText)) {
      return target.substr(trimText.length, target.length - trimText.length);
    }

    return target;
  }

  private updateCss(orderBy, elm, field) {
    elm.classList.remove('sorting');
    elm.classList.remove('sorting_asc');
    elm.classList.remove('sorting_desc');
    elm.classList.remove('sorting_asc_disabled');
    elm.classList.remove('sorting_desc_disabled');

    if (orderBy === undefined || orderBy === null) {
      elm.classList.add('sorting');
    } else {

      var descending = orderBy.indexOf('-') === 0;
      
      orderBy = this.trimStart(orderBy, '-');

      if (orderBy === field) {
        if (descending) {
          elm.classList.add('sorting_desc');
        } else {
          elm.classList.add('sorting_asc');
        }
      } else {
        elm.classList.add('sorting');
      }
    }
  }
}
