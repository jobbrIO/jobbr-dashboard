import { DiskInfoDto } from 'resources/api/dtos';
import { ApiClient } from 'resources/api/api-client';
import { autoinject } from 'aurelia-framework';
import { JobRunDto } from 'resources/api/dtos';

@autoinject()
export class Dashboard {

  public jobRuns: Array<JobRunDto>;
  public disks: Array<DiskInfoDto>;

  static finishedStates = ['Completed', 'Failed', 'Omitted', 'Deleted', 'Null'];
  static JobRunUpdateInterval = 5000;

  constructor(private apiClient: ApiClient) {
    apiClient.getDiskInfo().then(disks => this.disks = disks);
  }

  private updateRunningJobRuns(): Promise<any> {
    // api doesnt support that query currently. so we just get the last page of jobruns and filter the finished ones :)
    return this.apiClient.getRunningJobRuns().then(jobRuns => {
      let filtered = jobRuns.items.filter(p => { return Dashboard.finishedStates.indexOf(p.state) == -1; });
      this.jobRuns = filtered;
      console.log(this.jobRuns);
    });
  }

  private interval;

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
