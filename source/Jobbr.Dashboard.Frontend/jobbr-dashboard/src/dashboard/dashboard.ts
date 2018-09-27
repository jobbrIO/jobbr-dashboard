import { DiskInfoDto } from 'resources/api/dtos';
import { ApiClient } from 'resources/api/api-client';
import { autoinject } from 'aurelia-framework';
import { JobRunDto } from 'resources/api/dtos';

@autoinject()
export class Dashboard {
  
  static finishedStates = ['Completed', 'Failed', 'Omitted', 'Deleted', 'Null'];
  static JobRunUpdateInterval = 1000;

  public jobRuns: Array<JobRunDto>;
  public disks: Array<DiskInfoDto>;

  private interval;

  constructor(private apiClient: ApiClient) {
    apiClient.getDiskInfo().then(disks => this.disks = disks);
  }

  private updateRunningJobRuns(): Promise<any> {
    return this.apiClient.getRunningJobRuns().then(jobRuns => {
      this.jobRuns = jobRuns.items;
    });
  }

  attached() {
    this.updateRunningJobRuns().then(() => {
      this.interval = setInterval(() => this.updateRunningJobRuns(), Dashboard.JobRunUpdateInterval);
    });
  }

  detached() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
