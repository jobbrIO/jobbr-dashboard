import { autoinject, bindable, bindingMode } from "aurelia-framework";
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/dark.css';
import { Instance } from "flatpickr/dist/types/instance";
import * as moment from 'moment/moment';

@autoinject()
export class DateTimePickerCustomElement {

  @bindable({ defaultBindingMode: bindingMode.twoWay }) public value: string;

  constructor(private element: Element) {
  }

  attached() {
    let initialValue = null;

    if (this.value) {
      initialValue = new Date(this.value);
    }

    flatpickr(<HTMLElement>this.element.querySelector('.flatpickr'), {
      enableTime: true,
      dateFormat: "d.m.Y H:i",
      defaultDate: initialValue,
      allowInput: false,
      onChange: (dates: Date[], currentDateString: string, self: Instance, data?: any) => this.onChange(dates, currentDateString, self, data),
    });
  }

  private onChange(dates: Date[], currentDateString: string, self: Instance, data?: any) {
    let utcTime = this.convertToUtc(moment(dates[0]));

    this.value = utcTime.toISOString();
  }

  private convertToUtc(m) {
    return moment(m).utc().add(m.utcOffset(), 'm');
  }
}
