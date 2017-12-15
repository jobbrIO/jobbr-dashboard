export class JsonValueConverter {
  toView(object) {
    return JSON.stringify(object, null, 2);
  }
}
