import { JobDetailsDto } from './../resources/services/dtos';
import { ApiClient } from 'resources/services/api-client';
import { bindable } from 'aurelia-templating';
import { autoinject } from "aurelia-framework";

@autoinject
export class JobDetails {

  @bindable
  public jobId: number;

  private job: JobDetailsDto;

  constructor(private api: ApiClient) {
  }

  async attached() {
    this.job = await this.api.getJobDetails(this.jobId);
  }
}
