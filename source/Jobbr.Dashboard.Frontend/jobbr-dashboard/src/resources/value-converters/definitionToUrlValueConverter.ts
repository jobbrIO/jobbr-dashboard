export class DefinitionToUrlValueConverter {
  toView(value: string) {
    if (!value) {
      return '';
    }

    return value.split(' ').join('_');
  }  
}
