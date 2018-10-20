import { autoinject, bindable, LogManager } from 'aurelia-framework';

@autoinject
export class LoadingCustomAttribute {
  @bindable public func: any;
  @bindable public text: string;
  @bindable public spinOnly: boolean;

  private log: any;
  private running: boolean = false;
  private innerHtmlBackup: string;
  private spinner: Element;

  constructor(private element: Element) {
    this.log = LogManager.getLogger('LoadingCustomAttribute');
  }

  attached() {
    this.element.addEventListener('click', this.onClick);
  }

  detached() {
    this.element.removeEventListener('click', this.onClick);
  }

  onClick = (e: MouseEvent) => {
    if (this.running) {
      return;
    }

    this.running = true;
    this.startSpinner();  
    this.func().then(() => this.stopSpinner()).catch(() => this.stopSpinner());
  }

  startSpinner() {
    if (this.spinOnly) {
      let allIcons = this.element.querySelectorAll('.far,.fas,.fal');

      if (allIcons.length == 0) {
        this.log.error('tried to spin icon on ', this.element, ' but there is no element with fa class. please add an element with fa class.');
        return;
      } else if (allIcons.length > 1) {
        this.log.error('tried to spin icon on ', this.element, ' but found more than one icon to spin. i don\'t want to spin multiple icons ;)');
        return;
      }

      this.spinner = allIcons[0];

      if (this.spinner) {
        this.spinner.classList.add('fa-spin');
      }
    } else {
      this.innerHtmlBackup = this.element.innerHTML;
      this.element.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

      if (this.text) {
        this.element.innerHTML += ' ' + this.text;
      }
    }
  }

  stopSpinner() {
    if (this.innerHtmlBackup) {
      this.element.innerHTML = this.innerHtmlBackup;
      this.innerHtmlBackup = null;
    }

    if (this.spinner) {
      this.spinner.classList.remove('fa-spin');
      this.spinner = null;
    }

    this.running = false;
  }
}
