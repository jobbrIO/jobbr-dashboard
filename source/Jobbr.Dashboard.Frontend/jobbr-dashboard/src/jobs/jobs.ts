import { ApiClient } from '../resources/api/api-client';
import { JobDto } from '../resources/api/dtos';
import { autoinject } from 'aurelia-dependency-injection';
import * as $ from 'jquery';
import { PagedResult } from '../resources/api/paged-result';

@autoinject()
export class Jobs {
  public jobs: PagedResult<JobDto>;

  constructor(private api: ApiClient, private element: Element) {
  }

  public attached() {
    this.api.getAllJobs().then(r => this.jobs = r);
  }
}
