export class JsonValueConverter {
  toView(object) {
    return JSON.stringify(object, null, 2);
  }

  fromView(object) {
    if (!object) {
      return null;
    }

    try {
      return JSON.parse(object);
    } catch (e) {
      return null;
    }
  }
}
