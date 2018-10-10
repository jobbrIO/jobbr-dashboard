import { JobDto, JobRunDto, JobTriggerDto } from '../resources/api/dtos';
import { ApiClient } from '../resources/api/api-client';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject
export class RunDetail {
  public jobRunId: number;
  public jobRun: JobRunDto;
  public trigger: JobTriggerDto;
  public job: JobDto;
  public apiUrl: string;

  constructor (
    private apiClient: ApiClient,
    private router: Router,
    ) {
  }

  async activate(params, routeConfig, navigationInstruction) {
    this.jobRunId = params.id;

    this.apiUrl = await this.apiClient.getApiUrl();

    this.apiClient.getJobRun(this.jobRunId).then(jobRun => {
      this.jobRun = jobRun;
      this.apiClient.getJob(jobRun.jobId).then(job => this.job = job);
      this.apiClient.getTrigger(jobRun.jobId, jobRun.triggerId).then(trigger => this.trigger = trigger);
    });
  }
}
