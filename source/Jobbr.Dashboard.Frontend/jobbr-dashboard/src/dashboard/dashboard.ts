import { DiskInfoDto } from './../resources/services/dtos';
import { ApiClient } from 'resources/services/api-client';
import { autoinject } from 'aurelia-framework';
import { JobRunDto } from 'resources/services/dtos';

@autoinject()
export class Dashboard {

  public jobRuns: Array<JobRunDto>;
  public disks: Array<DiskInfoDto>;

  constructor(apiClient: ApiClient) {
    const finishedStates = ['Completed', 'Failed', 'Omitted', 'Deleted', 'Null'];

    apiClient.getDiskInfo().then(disks => this.disks = disks);

    // api doesnt support that query currently. so we just get the last page of jobruns and filter the finished ones :)
    apiClient.getJobRuns().then(jobRuns => {
      let filtered = jobRuns.filter(p => { return finishedStates.indexOf(p.state) == -1; });
      this.jobRuns = filtered;
    });
  }
}
