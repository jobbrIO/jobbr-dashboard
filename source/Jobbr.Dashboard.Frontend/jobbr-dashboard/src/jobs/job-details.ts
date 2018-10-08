import { JobDetailsDto, JobRunDto, JobTriggerDto } from 'resources/api/dtos';
import { ApiClient } from 'resources/api/api-client';
import { bindable } from 'aurelia-templating';
import { autoinject } from "aurelia-framework";
import { PagedResult } from 'resources/api/paged-result';
import { ToastService } from 'resources/services/toast';

@autoinject()
export class JobDetails {

  @bindable()
  public jobId: number;

  public jobRuns: PagedResult<JobRunDto>;
  public triggers: PagedResult<JobTriggerDto>;
  public triggersPage: number = 1;

  public job: JobDetailsDto;

  constructor(
    private api: ApiClient,
    private toastService: ToastService
    ) {
  }

  async activate(params, routeConfig, navigationInstruction) {
    this.jobId = params.id;
    
    this.job = await this.api.getJobDetails(this.jobId);
    this.jobRuns = await this.api.getJobRunsByJobId(this.jobId, 1, "-ActualEndDateTimeUtc", null, 10);
    await this.loadTriggers();
  }

  public disableTrigger(trigger) {
    trigger.isActive = false;
    this.toastService.handleSave(this.api.updateTrigger(trigger, this.jobId));
  }

  public enableTrigger(trigger) {
    trigger.isActive = true;
    this.toastService.handleSave(this.api.updateTrigger(trigger, this.jobId));
  }

  public changeTriggersPage(page) {
    this.triggersPage = page;
    this.loadTriggers();
  }

  private async loadTriggers() {
    this.triggers = await this.api.getTriggersByJobId(this.jobId, this.triggersPage);
  }
}
