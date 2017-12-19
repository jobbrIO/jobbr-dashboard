import { DashboardMemoryResponse, JobDto } from './dtos';
import { autoinject } from "aurelia-framework";
import { HttpClient } from 'aurelia-fetch-client';

@autoinject
export class ApiClient {

  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
      
    this.httpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withBaseUrl('http://localhost:1338');
    });
  }

  getCpuInfo(): Promise<number> {
    return this.httpClient.fetch('/dashboard/system/cpu').then(r => r.json()).catch(e => console.log(e));
  }

  getMemoryInfo(): Promise<DashboardMemoryResponse> {
    return this.httpClient.fetch('/dashboard/system/memory').then(r => r.json());
  }

  getAllJobs(): Promise<Array<JobDto>> {
    return this.httpClient.fetch('/jobs').then(r => r.json());
  }

  getJobRunsByJobId(jobId: number) {
    let httpClient = new HttpClient();

    httpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withBaseUrl('http://localhost:1338/jobs/' + jobId + '/runs');
    });

    return httpClient.fetch('').then(response => response.json());
  }
}
