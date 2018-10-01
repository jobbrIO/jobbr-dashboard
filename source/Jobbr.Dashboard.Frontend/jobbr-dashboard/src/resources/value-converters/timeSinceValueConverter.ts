export class TimeSinceValueConverter {
  toView(value, fromDate) {

    if (!value) {
      return '';
    }

    if (!fromDate) {
      fromDate = new Date();
    } else {
      fromDate = new Date(fromDate);
    }

    let date: Date = new Date(value);

    var seconds = Math.abs(Math.floor((fromDate.getTime() - date.getTime()) / 1000));

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }

    interval = Math.floor(seconds / 2592000);

    if (interval > 1) {
      return interval + " months";
    }

    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
      return interval + " days";
    }

    interval = Math.floor(seconds / 3600);

    if (interval > 1) {
      return interval + " hours";
    }

    interval = Math.floor(seconds / 60);

    if (interval >= 1) {
      return interval + " minutes";
    }

    if (seconds <= 1) {
      return "0." + Math.abs(fromDate.getTime() - date.getTime()) + " seconds";
    }

    return Math.floor(seconds) + " seconds";
  }
}
