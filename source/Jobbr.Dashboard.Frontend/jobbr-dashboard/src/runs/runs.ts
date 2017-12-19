import { ApiClient } from './../resources/services/api-client';
import { autoinject } from 'aurelia-framework';

@autoinject
export class Runs {
  public jobId: string;
  public jobRuns;

  constructor(private apiClient: ApiClient) {
  }

  activate(params, routeConfig, navigationInstruction) {
    this.jobId = params.jobId;

    if (this.jobId) {

    } else {
      this.apiClient.getJobRuns().then(runs => this.jobRuns = runs);
    }
  }
}
