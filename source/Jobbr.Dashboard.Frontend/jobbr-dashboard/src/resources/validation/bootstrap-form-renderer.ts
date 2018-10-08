import {
  ValidationRenderer,
  RenderInstruction,
  ValidateResult
} from 'aurelia-validation';

export class BootstrapFormRenderer {
  render(instruction) {
    for (let { result, elements } of instruction.unrender) {
      for (let element of elements) {
        this.remove(element, result);
      }
    }

    for (let { result, elements } of instruction.render) {
      for (let element of elements) {
        this.add(element, result);
      }
    }
  }

  add(element: Element, result: ValidateResult) {
    if (result.valid) {
      return;
    }

    // for froala
    if (element.nodeName == "#comment") {
      // we are sitting on an aurelia custom element, eg. location-search
      element = element.parentElement;
    }

    element.parentElement.classList.add('was-validated');

    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
      element.setCustomValidity(result.message);
    } else {
      let e = element.querySelector('input');

      if (e) {
        e.setCustomValidity(result.message);
      }
    }

    // add help-block
    const message = document.createElement('div');
    message.className = 'invalid-feedback';
    message.textContent = result.message;
    message.id = `validation-message-${result.id}`;

    element.parentElement.appendChild(message);
  }

  remove(element: Element, result) {
    if (result.valid) {
      return;
    }

    // for froala
    if (element.nodeName == "#comment") {
      // we are sitting on an aurelia custom element, eg. location-search
      element = element.parentElement;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
      element.setCustomValidity(''); // empty string = no error
    } else {
      let e = element.querySelector('input');

      if (e) {
        e.setCustomValidity('');
      }
    }

    // remove help-block
    const message = element.parentElement.querySelector(`#validation-message-${result.id}`);
    if (message) {
      element.parentElement.removeChild(message);
    }
  }
}
