import { json } from "stream/consumers";
import { PagedResult } from "./paged-result";

export class JobDto {
  id: number;
  uniqueName: string;
  type: string;
  parameters: any;
}

export class JobRunDto {
  jobRunId: number;
  jobId: number;
  triggerId: number;
  jobParameter: string;
  instanceParameter: string;
  jobName: string;
  state: string;
  progress: number;
  plannedStartUtc: string;
  actualStartUtc: string;
  estimatedEndUtc: string;
  actualEndUtc: string;
  artefacts: Array<JobRunArtefactDto>;
  jobTitle: string;
}

export class JobRunArtefactDto {
  filename: string;
  size: number;
  contentType: string
}

export class JobTriggerDto {
  id: number;
  triggerType: string;
  isActive: boolean;
  parameters: string;
  comment: string;
  userId: string;
  userDisplayName: string;
  startDateTimeUtc: string;
  endDateTimeUtc: string;
  definition: string;
  delayedMinutes: number;
}

export class JobDetailsDto {
  id: number;
  uniqueName: string;
  type: string;
  parameters: string;
  trigger: Array<JobTriggerDto>;
}

export async function getScheduledAndRunningJobs() : Promise<PagedResult<JobRunDto>> {
  const jobRuns = await fetch(
    "http://localhost:1337/jobruns/?sort=-PlannedStartDateTimeUtc&pageSize=200&states=Scheduled,Preparing,Starting,Started,Connected,Initializing,Processing,Finishing,Collecting"
  );
  return jobRuns.json();
}

export async function getLastFiveFailedJobRuns() : Promise<PagedResult<JobRunDto>> {
  const failedJobRuns = await fetch("http://localhost:1337/jobruns/?sort=-ActualEndDateTimeUtc&pageSize=5&states=Failed");
  return failedJobRuns.json();
}

export async function getAvailalbeJobs() : Promise<PagedResult<JobDto>> {
  const jobs = await fetch("http://localhost:1337/jobs?pageSize=10000");
  return jobs.json();
}

export async function getAllJobRuns() : Promise<PagedResult<JobRunDto>> {
  const jobRuns = await fetch(
    "http://localhost:1337/jobruns/?page=1&sort=-PlannedStartDateTimeUtc&query=&showDeleted=false&states="
  );
  return jobRuns.json();
}

export async function getJobRuns(jobId: number) : Promise<PagedResult<JobRunDto>> {
  const jobRuns = await fetch(
    `http://localhost:1337/jobs/${jobId}/runs?page=1&sort=-ActualEndDateTimeUtc&showDeleted=false&pageSize=10`
  );
  return jobRuns.json();
}

export async function getJob(jobId: number) : Promise<JobDto> {
  const jobRuns = await fetch(
    `http://localhost:1337/jobs/${jobId}`
  );
  return jobRuns.json();
}