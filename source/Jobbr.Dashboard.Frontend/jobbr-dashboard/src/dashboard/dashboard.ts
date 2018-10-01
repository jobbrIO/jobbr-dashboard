import { DiskInfoDto } from 'resources/api/dtos';
import { ApiClient } from 'resources/api/api-client';
import { autoinject } from 'aurelia-framework';
import { JobRunDto } from 'resources/api/dtos';

@autoinject()
export class Dashboard {
  
  static finishedStates = ['Completed', 'Failed', 'Omitted', 'Deleted', 'Null'];
  static JobRunUpdateInterval = 1000;
  static FailedJobRunUpdateInterval = 5000;

  public jobRuns: Array<JobRunDto>;
  public disks: Array<DiskInfoDto>;

  public lastFailedJobRuns: Array<JobRunDto>;

  private jobRunsInterval;
  private lastFailedJobRunsInterval;

  constructor(private apiClient: ApiClient) {
    apiClient.getDiskInfo().then(disks => this.disks = disks);
  }

  private updateRunningJobRuns(): Promise<any> {
    return this.apiClient.getRunningJobRuns().then(jobRuns => {
      this.jobRuns = jobRuns.items;
    });
  }

  private updateLastFailedJobRuns(): Promise<any> {
    return this.apiClient.getLastFailedJobRuns().then(jobRuns => {
      this.lastFailedJobRuns = jobRuns.items;
    });
  }

  attached() {
    this.updateRunningJobRuns().then(() => {
      this.jobRunsInterval = setInterval(() => this.updateRunningJobRuns(), Dashboard.JobRunUpdateInterval);
    });

    this.updateLastFailedJobRuns().then(() => {
      this.lastFailedJobRunsInterval = setInterval(() => this.updateLastFailedJobRuns, Dashboard.FailedJobRunUpdateInterval);
    })
  }

  detached() {
    if (this.jobRunsInterval) {
      clearInterval(this.jobRunsInterval);
    }

    if (this.lastFailedJobRunsInterval) {
      clearInterval(this.lastFailedJobRunsInterval);
    }
  }
}
