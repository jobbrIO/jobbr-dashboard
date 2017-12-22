export class FileSizeValueConverter {
  toView(value) {
    let i = -1;
    const units = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

    if (value == 0) {
      return '0' + units[0];
    }

    do {
      value = value / 1024;
      i++;
    } while (value > 1024);

    return Math.max(value, 0.1).toFixed(1) + units[i];
  }
}
