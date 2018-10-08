import 'izitoast/dist/css/iziToast.css';
import * as iziToast from 'izitoast';
import { singleton } from 'aurelia-framework';

@singleton()
export class ToastService {
  public success(title: string, message: string) {
    iziToast.default.success({
      title: title,
      message: message,
      position: 'topCenter'
    });
  }

  public error(title: string, message: string) {
    iziToast.default.error({
      title: title,
      message: message,
      position: 'topCenter'
    });
  }

  public warning(title: string, message: string) {
    iziToast.default.error({
      title: title,
      message: message,
      position: 'topCenter'
    });
  }

  public info(title: string, message: string) {
    iziToast.default.info({
      title: title,
      message: message,
      position: 'topCenter'
    });
  }

  public handleSave(promise: Promise<any>) {
    return promise.then(() => this.saveSuccess()).catch((e) => this.saveError(e));
  }

  private saveError(e) {
    this.error('Error', 'Could not save');
  }

  private saveSuccess() {
    this.success('Saved', '');
  }
}
