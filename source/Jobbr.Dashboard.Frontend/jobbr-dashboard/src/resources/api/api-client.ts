import { DashboardMemoryResponse, DiskInfoDto, JobDetailsDto, JobDto, JobRunDto, JobTriggerDto } from './dtos';
import { autoinject } from "aurelia-framework";
import { HttpClient, json } from 'aurelia-fetch-client';
import { PagedResult } from './paged-result';

@autoinject
export class ApiClient {

  // those urls are only used for testing within Jobbr.Dashboard solution using webpack build
  private WebpackUrl = 'http://localhost:1337';
  private TestJobbrUrl = 'http://localhost:1338';

  private apiClient: HttpClient; // client for accessing rest api provided by Jobbr.Server.WebApi
  private dashboardClient: HttpClient; // client for accessing rest api provided by Jobbr.Dashboard

  private apiUrl: string;

  private initPromise: Promise<any>;

  constructor() {
    this.dashboardClient = new HttpClient();
    this.dashboardClient.configure(config => {
      config
      .useStandardConfiguration()
      .withDefaults({
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'Fetch'
        }
      })
      .withBaseUrl(window.location.origin.replace(this.WebpackUrl, this.TestJobbrUrl));
    });

    this.initPromise = this.dashboardClient.fetch('/config').then(async r => {
      let json = await r.json();
      this.apiUrl = json['api'];

      this.initApiClient();
    });
  }

  private initApiClient() {
    this.apiClient = new HttpClient();

    this.apiClient.configure(config => {
      config
        .useStandardConfiguration()
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withBaseUrl(this.apiUrl);
    });
  }

  public getApiUrl(): Promise<string> {
    return this.initPromise.then(() => this.apiUrl);
  }

  getCpuInfo(): Promise<number> {
    return this.initPromise.then(() => this.dashboardClient.fetch('/system/cpu').then(r => r.json()));
  }

  getMemoryInfo(): Promise<DashboardMemoryResponse> {
    return this.initPromise.then(() =>  this.dashboardClient.fetch('/system/memory').then(r => r.json()));
  }

  getDiskInfo(): Promise<Array<DiskInfoDto>> {
    return this.initPromise.then(() => this.dashboardClient.fetch('/system/disks').then(r => r.json()));
  }

  getAllJobs(): Promise<PagedResult<JobDto>> {
    return this.initPromise.then(() =>  this.apiClient.fetch('/jobs?pageSize=10000').then(r => r.json()));
  }

  getJob(id: number): Promise<JobDto> {
    return this.initPromise.then(() =>  this.apiClient.fetch('/jobs/' + id).then(r => r.json()));
  }

  getJobRunsByJobId(jobId: number, page: number = 1, sort: string = '', states: Array<string> = null, pageSize: number = null): Promise<PagedResult<JobRunDto>> {
    let url = '/jobs/' + jobId + '/runs?page=' + page + '&sort=' + sort;

    // todo: states not yet supported here by webapi
    if (states) {
      url = url += '&states=' + states.join(',');
    }

    if (pageSize) {
      url = url += '&pageSize=' + pageSize;
    }

    return this.initPromise.then(() =>  this.apiClient.fetch(url).then(r => r.json()));
  }

  getJobRuns(page: number = 1, sort: string = '', query: string = '', states: Array<string> = null): Promise<PagedResult<JobRunDto>> {
    let url = '/jobruns/?page=' + page + '&sort=' + sort + '&query=' + query;

    if (states) {
      url = url += '&states=' + states.join(',');
    }

    return this.initPromise.then(() => this.apiClient.fetch(url).then(r => r.json()));
  }

  getLastFailedJobRuns() {
    return this.initPromise.then(() => this.apiClient.fetch('/jobruns/?sort=-ActualEndDateTimeUtc&pageSize=5&states=Failed').then(r => r.json()));
  }
  
  getJobRun(id: number): Promise<JobRunDto> {
    return this.initPromise.then(() => this.apiClient.fetch('/jobruns/' + id).then(r => r.json()));
  }

  getTriggersByJobId(jobId: number, page: number = 1): Promise<PagedResult<JobTriggerDto>> {
    return this.initPromise.then(() => this.apiClient.fetch('/jobs/' + jobId + '/triggers/?pageSize=5&page=' + page).then(r => r.json()));
  }

  getTrigger(jobId: number, triggerId: number): Promise<JobTriggerDto> {
    return this.initPromise.then(() => this.apiClient.fetch('/jobs/' + jobId + '/triggers/' + triggerId).then(r => r.json()));
  }

  getJobDetails(jobId: number): Promise<JobDetailsDto> {
    return this.initPromise.then(() => this.apiClient.fetch('/jobs/' + jobId).then(r => r.json()));
  }

  getRunningJobRuns(): Promise<PagedResult<JobRunDto>> {
    return this.initPromise.then(() => this.apiClient.fetch('/jobruns/?sort=-PlannedStartDateTimeUtc&pageSize=200&states=Scheduled,Preparing,Starting,Started,Connected,Initializing,Processing,Finishing,Collecting').then(r => r.json()));
  }
  
  updateTrigger(trigger, jobId): Promise<any> {
    return this.initPromise.then(() => {
      this.apiClient.fetch('/jobs/' + jobId + '/triggers/' + trigger.id, {
        method: 'patch',
        body: json(trigger)
      }).catch(e => console.log(e));
    });
  }

  createTrigger(trigger, jobId): Promise<any> {
    return this.initPromise.then(() => {
      this.apiClient.fetch('/jobs/' + jobId + '/triggers/', {
        method: 'post',
        body: json(trigger)
      }).catch(e => console.log(e));
    });
  }
}
