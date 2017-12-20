export class FileSizeValueConverter {
  toView(value) {
    let i = -1;
    let units = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

    do {
      value = value / 1024;
      i++;
    } while (value > 1024);

    return Math.max(value, 0.1).toFixed(1) + units[i];
  }
}
