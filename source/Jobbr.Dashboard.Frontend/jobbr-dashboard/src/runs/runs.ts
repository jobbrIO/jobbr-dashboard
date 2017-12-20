import { JobDto } from './../resources/services/dtos';
import { ApiClient } from './../resources/services/api-client';
import { autoinject } from 'aurelia-framework';

@autoinject
export class Runs {
  public jobId: number;
  public jobRuns;
  public job: JobDto;

  constructor(private apiClient: ApiClient) {
  }

  activate(params, routeConfig, navigationInstruction) {
    this.jobId = params.jobId;

    if (this.jobId) {
      this.apiClient.getJobRunsByJobId(this.jobId).then(runs => this.jobRuns = runs)
      this.apiClient.getJob(this.jobId).then(job => this.job = job);
    } else {
      this.apiClient.getJobRuns().then(runs => this.jobRuns = runs);
    }
  }
}
