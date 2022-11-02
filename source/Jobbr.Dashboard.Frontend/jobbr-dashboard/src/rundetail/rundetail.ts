import { JobDto, JobRunDto, JobTriggerDto } from '../resources/api/dtos';
import { ApiClient } from '../resources/api/api-client';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ToastService } from 'resources/services/toast';

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
    private toastService: ToastService,
    ) {
  }

  async activate(params, routeConfig, navigationInstruction) {
    this.jobRunId = params.id;

    this.apiUrl = await this.apiClient.getApiUrl();

    this.load();
  }

  private load() {
    this.apiClient.getJobRun(this.jobRunId).then(jobRun => {
      this.jobRun = jobRun;
      this.apiClient.getJob(jobRun.jobId).then(job => this.job = job);
      this.apiClient.getTrigger(jobRun.jobId, jobRun.triggerId).then(trigger => this.trigger = trigger);
    });
  }

  public retryJobRun(jobRun: JobRunDto): Promise<any> {
    return this.apiClient.retryJobRun(jobRun).then(() => {
      this.toastService.info('OK', 'Retrying jobrun...');
      this.load();
    });
  }

  public refresh(): Promise<any> {
    return this.apiClient.getJobRun(this.jobRunId).then(jobRun => {
      this.jobRun = jobRun;
    });
  }

  public delete(jobRun: JobRunDto): Promise<any> {
    return this.apiClient.deleteJobRun(jobRun.jobRunId).then(() => {
      this.refresh();
    });
  }
}
