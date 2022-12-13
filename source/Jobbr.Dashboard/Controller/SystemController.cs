using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using Jobbr.Dashboard.Model;
using Jobbr.Server.WebAPI;
using Microsoft.AspNetCore.Mvc;

namespace Jobbr.Dashboard.Controller
{
    public class SystemController : ControllerBase
    {
        private readonly JobbrWebApiConfiguration webApiConfiguration;
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
        public IActionResult GetCpuLoad()
        {
            return Ok(Cpu.NextValue());
        }

        [HttpGet]
        [Route("system/memory")]
        public IActionResult GetMemoryUsage()
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
        public IActionResult GetDiskUsage()
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

        [HttpGet]
        [Route("signalr/trigger")]
        public IActionResult TriggerSignalR()
        {
            return Ok();
        }   
    }
}
