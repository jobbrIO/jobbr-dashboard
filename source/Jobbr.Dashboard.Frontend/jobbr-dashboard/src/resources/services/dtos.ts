export class JobDto {
  id: number;
  uniqueName: string;
  type: string;
  parameters: any;
}

export class DashboardMemoryResponse {
  totalPhysicalMemory: number;
  freeMemory: number
}

export class JobRunDto {
  jobId: number;
  triggerId: number;
  jobParameter: string;
  instanceParameter: string;
  jobName: string;
  state: string;
  progress: number;
  plannedStartUtc: string;
  auctualStartUtc: string;
  estimatedEndUtc: string;
  auctualEndUtc: string;
  artefacts: Array<JobRunArtefactDto>;
  jobTitle: string;
}

export class JobRunArtefactDto {
  filename: string;
  size: number;
  contentType: string
}
