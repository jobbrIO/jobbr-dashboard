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
    // api doesnt support that query currently. so we just get the last page of jobruns and filter the finished ones :)
    return this.apiClient.getRunningJobRuns().then(jobRuns => {
      let filtered = jobRuns.items.filter(p => { return Dashboard.finishedStates.indexOf(p.state) == -1; });
      this.jobRuns = filtered;
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
