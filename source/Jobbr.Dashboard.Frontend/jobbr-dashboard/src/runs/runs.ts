import { JobRunDto } from './../resources/api/dtos';
import { JobDto } from '../resources/api/dtos';
import { ApiClient } from '../resources/api/api-client';
import { autoinject, observable } from 'aurelia-framework';
import { PagedResult } from '../resources/api/paged-result';

@autoinject()
export class Runs {
  public jobId: number;
  public jobRuns: PagedResult<JobRunDto>;
  public job: JobDto;
  public currentPage: number = 1;

  @observable()
  public query: string = '';

  @observable()
  public orderBy: string = '-PlannedStartDateTimeUtc';

  @observable()
  public states: Array<string> = [];

  @observable()
  public showDeleted: boolean;

  private activated: boolean = false;

  constructor(private apiClient: ApiClient) {
  }

  showDeletedChanged() {
    this.loadData();
  }

  activate(params, routeConfig, navigationInstruction) {
    this.jobId = params.jobId;

    this.activated = true;

    this.loadData();
  }

  loadData() {
    if (this.activated) {
      if (this.jobId) {
        this.apiClient.getJobRunsByJobId(this.jobId, this.currentPage, this.orderBy, this.states, 50, this.showDeleted).then(runs => this.jobRuns = runs);

        if (!this.job) {
          this.apiClient.getJob(this.jobId).then(job => this.job = job);
        }
      } else {
        this.apiClient.getJobRuns(this.currentPage, this.orderBy, this.query, this.states, this.showDeleted).then(runs => this.jobRuns = runs);
      }
    }
  }

  changePage(page: number) {
    this.currentPage = page;

    this.loadData();
  }

  orderByChanged() {
    this.loadData();
  }

  queryChanged() {
    this.loadData();
  }

  statesChanged() {
    this.loadData();
  }
}
