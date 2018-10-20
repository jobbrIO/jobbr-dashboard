import { ToastService } from './../resources/services/toast';
import { JobDto, JobTriggerDto } from './../resources/api/dtos';
import { ApiClient } from 'resources/api/api-client';
import { autoinject, observable } from "aurelia-framework";
import * as prettyCron from 'prettycron';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { Router } from 'aurelia-router';


@autoinject()
export class Detail {

  public job: JobDto;
  public trigger: JobTriggerDto;
  public isNew: boolean;

  @observable()
  public definition: string;
  public definitionHuman: string;

  @observable()
  public parameters: string;

  constructor(
    private api: ApiClient,
    private toastService: ToastService,
    private validation: ValidationController,
    private router: Router,
  ) {
    //return cronvalidator.isValid("* * * * *", true);
  }

  async activate(params, routeConfig, navigationInstruction) {
    this.isNew = params.triggerId === 'new';

    if (this.isNew == false) {
      const [job, trigger] = await Promise.all([
        this.api.getJobDetails(params.jobId),
        this.api.getTrigger(params.jobId, params.triggerId)
      ]);

      this.job = job;
      this.trigger = trigger;

      this.definition = this.trigger.definition;
      this.parameters = JSON.stringify(this.trigger.parameters, null, 2);
    } else {
      this.job = await this.api.getJobDetails(params.jobId);
      this.trigger = new JobTriggerDto();
      this.trigger.isActive = true;
      this.trigger.triggerType = 'Instant';

      ValidationRules
        .ensure((c: JobTriggerDto) => c.startDateTimeUtc).required().when(p => p.triggerType == 'Instant' || p.triggerType == "Scheduled").withMessage('required')
        .on(this.trigger);
    }

    ValidationRules
      .ensure((c: Detail) => c.parameters).satisfies((v) => this.isValidJsonString(v))
      .ensure(c => c.definition).required().when(p => p.trigger.triggerType == 'Recurring')
      .ensure(c => c.definition).satisfies((v) => this.validateCron(v)).when(p => p.trigger.triggerType == 'Recurring')
      .on(this);
  }

  private validateCron(cron: string): boolean {
    try {
      return true;
    } catch {
      return false;
    }
  }

  private isValidJsonString(str): boolean {
    if (!str) {
      return true;
    }

    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }

    return true;
  }

  definitionChanged(newValue) {
    this.definitionHuman = prettyCron.toString(newValue);
    this.trigger.definition = newValue;
  }

  parametersChanged(newValue) {
    try {
      this.trigger.parameters = JSON.parse(newValue);
    } catch {
    }
  }

  public async save(): Promise<any> {
    let validationResult = await this.validation.validate();

    if (validationResult.valid) {
      if (this.isNew == false) {
        return this.toastService.handleSave(this.api.updateTrigger(this.trigger, this.job.id));
      } else {
        return this.toastService.handleSave(this.api.createTrigger(this.trigger, this.job.id)).then(() => {
          this.router.navigateToRoute('jobdetail', { id: this.job.id });
        });
      }
    } else {
      this.toastService.error('Validation Errors', 'Please check your input');
    }
  }

  public setType(newType: string) {
    if (this.isNew) {
      this.trigger.triggerType = newType;
    }
  }
}
