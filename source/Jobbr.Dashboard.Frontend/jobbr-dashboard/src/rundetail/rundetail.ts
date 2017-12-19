import { JobDto, JobRunDto } from './../resources/services/dtos';
import { ApiClient } from './../resources/services/api-client';
import { autoinject } from 'aurelia-framework';

@autoinject
export class RunDetail {
  public jobRunId: number;
  public jobRun: JobRunDto;
  public job: JobDto;

  constructor(private apiClient: ApiClient) {
  }

  activate(params, routeConfig, navigationInstruction) {
    this.jobRunId = params.id;

    this.apiClient.getJobRun(this.jobRunId).then(jobRun => {
      this.jobRun = jobRun;
      this.apiClient.getJob(jobRun.jobId).then(job => this.job = job);
    });
  }
}
