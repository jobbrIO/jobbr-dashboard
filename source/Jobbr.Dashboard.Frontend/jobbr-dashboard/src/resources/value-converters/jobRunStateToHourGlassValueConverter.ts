export class JobRunStateToHourGlassValueConverter {
  toView(value: string) {
    if (!value) {
      return '';
    }

    switch(value) {
      case 'Null': return 'far fa-hourglass';
      case 'Scheduled': return 'fas fa-hourglass-start';
      case 'Preparing': return 'fas fa-hourglass-start';
      case 'Starting': return 'fas fa-hourglass-start';
      case 'Started': return 'fas fa-hourglass-half';
      case 'Connected': return 'fas fa-hourglass-half';
      case 'Initializing': return 'fas fa-hourglass-half';
      case 'Processing': return 'fas fa-hourglass-half';
      case 'Finishing': return 'fas fa-hourglass-half';
      case 'Collecting': return 'fas fa-hourglass-half';
      case 'Completed': return 'fas fa-hourglass-end';
      case 'Failed': return 'far fa-hourglass';
      case 'Deleted': return 'far fa-hourglass';
      case 'Omitted': return 'far fa-hourglass';

      default: return 'far fa-hourglass';
    }
  }
}
