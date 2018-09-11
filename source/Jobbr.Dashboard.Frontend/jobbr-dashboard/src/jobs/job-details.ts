import { JobDetailsDto } from 'resources/api/dtos';
import { ApiClient } from 'resources/api/api-client';
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
