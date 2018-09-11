import { JobDto } from '../resources/api/dtos';
import { ApiClient } from '../resources/api/api-client';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class Runs {
  public jobId: number;
  public jobRuns;
  public job: JobDto;

  constructor(private apiClient: ApiClient) {
  }

  activate(params, routeConfig, navigationInstruction) {
    this.jobId = params.jobId;

    if (this.jobId) {
      this.apiClient.getJobRunsByJobId(this.jobId).then(runs => this.jobRuns = runs.items);
      this.apiClient.getJob(this.jobId).then(job => this.job = job);
    } else {
      this.apiClient.getJobRuns().then(runs => this.jobRuns = runs.items);
    }
  }
}
