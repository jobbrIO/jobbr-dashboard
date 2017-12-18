import { autoinject } from 'aurelia-framework';

@autoinject
export class Runs {
  public jobId: string;

  activate(params, routeConfig, navigationInstruction) {
    this.jobId = params.jobId;
  }
}
