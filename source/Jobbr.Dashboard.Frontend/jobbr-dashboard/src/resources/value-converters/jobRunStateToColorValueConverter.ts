export class JobRunStateToColorValueConverter {
  toView(value: string) {
    if (!value) {
      return '';
    }

    switch(value) {
      case 'Null': return '';
      case 'Scheduled': return '';
      case 'Preparing': return 'text-warning';
      case 'Starting': return 'text-warning';
      case 'Started': return 'text-warning';
      case 'Connected': return 'text-warning';
      case 'Initializing': return 'text-warning';
      case 'Processing': return 'text-warning';
      case 'Finishing': return 'text-warning';
      case 'Collecting': return 'text-warning';
      case 'Completed': return 'text-success';
      case 'Failed': return 'text-error';
      case 'Deleted': return 'text-info';
      case 'Omitted': return 'text-info';

      default: return '';
    }
  }
}
