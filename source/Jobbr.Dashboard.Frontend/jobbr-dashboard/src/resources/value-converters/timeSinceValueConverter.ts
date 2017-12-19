export class TimeSinceValueConverter {
  toView(value, fromDate) {

    if (!value) {
      return '';
    }

    let date: Date = new Date(value);

    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " Jahre";
    }

    interval = Math.floor(seconds / 2592000);

    if (interval > 1) {
      return interval + " Monate";
    }

    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
      return interval + " Tagen";
    }

    interval = Math.floor(seconds / 3600);

    if (interval > 1) {
      return interval + " Stunden";
    }

    interval = Math.floor(seconds / 60);

    if (interval > 1) {
      return interval + " Minuten";
    }

    return Math.floor(seconds) + " Sekunden";
  }
}
