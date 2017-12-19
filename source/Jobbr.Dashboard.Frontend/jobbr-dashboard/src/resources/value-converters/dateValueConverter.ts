import * as moment from 'moment/moment';

export class DateValueConverter {
  toView(value, format) {
    if (value) {
      if (!format)
        format = 'DD.MM.YYYY HH:mm';

      return moment(value).format(format);
    } else {
      return "-";
    }
  }
}
