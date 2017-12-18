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
