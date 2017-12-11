using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Web.Http;
using Jobbr.Dashboard.Backend.Model;

namespace Jobbr.Dashboard.Backend.Controller
{
    public class SystemController : ApiController
    {
        private static readonly PerformanceCounter Cpu;
        private static readonly PerformanceCounter Memory;
        private static readonly ulong TotalPhysicalMemory;

        static SystemController()
        {
            Cpu = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            Memory = new PerformanceCounter("Memory", "Available MBytes", string.Empty);

            var memStatus = new MemoryStatusEx();
            if (NativeMethods.GlobalMemoryStatusEx(memStatus))
            {
                TotalPhysicalMemory = memStatus.ullTotalPhys;
            }
        }

        [HttpGet]
        [Route("system/cpu")]
        public IHttpActionResult GetCpuLoad()
        {
            return Ok(Cpu.NextValue());
        }

        [HttpGet]
        [Route("system/memory")]
        public IHttpActionResult GetMemoryUsage()
        {
            var totalPhysicalMemory = TotalPhysicalMemory / (double) 1024 / (double) 1024;
            var freeMemory = (double)Memory.NextValue();

            return Ok(new
            {
                TotalPhysicalMemory = totalPhysicalMemory,
                FreeMemory = freeMemory
            });
        }

        [HttpGet]
        [Route("system/disks")]
        public IHttpActionResult GetDiskUsage()
        {
            var driveInfos = new List<DiskInfoDto>();

            // ReSharper disable once LoopCanBeConvertedToQuery
            foreach (var drive in DriveInfo.GetDrives())
            {
                var dto = new DiskInfoDto
                {
                    Name = drive.Name,
                    FreeSpace = drive.AvailableFreeSpace,
                    FreeSpacePercentage = (drive.TotalFreeSpace / (double) drive.TotalSize) * 100,
                    TotalSpace = drive.TotalSize,
                    Type = drive.DriveType.ToString()
                };
                
                driveInfos.Add(dto);
            }

            return Ok(driveInfos);
        }
    }
}
