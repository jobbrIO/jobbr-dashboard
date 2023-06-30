export class DashboardMemoryResponse {
  totalPhysicalMemory: number;
  freeMemory: number
}

export class DiskInfoDto {
  name: string;
  freeSpace: number;
  totalSPace: number;
  freeSpacePercentage: number;
  type: string;
}

export async function getDisks(): Promise<DiskInfoDto> {
  const disks = await fetch("http://localhost:1338/system/disks");
  return disks.json();
}
