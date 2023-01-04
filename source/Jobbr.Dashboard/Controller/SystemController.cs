using Jobbr.Dashboard.Model;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;

namespace Jobbr.Dashboard.Controller
{
    [ApiController]
    public class SystemController : ControllerBase
    {
        private static readonly PerformanceCounter _cpu;
        private static readonly PerformanceCounter _memory;
        private static readonly ulong _totalPhysicalMemory;

        static SystemController()
        {
            _cpu = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            _memory = new PerformanceCounter("Memory", "Available MBytes", string.Empty);

            var memStatus = new MemoryStatusEx();
            if (NativeMethods.GlobalMemoryStatusEx(memStatus))
            {
                _totalPhysicalMemory = memStatus.ullTotalPhys;
            }
        }

        [HttpGet("system/cpu")]
        public IActionResult GetCpuLoad()
        {
            return Ok(_cpu.NextValue());
        }

        [HttpGet("system/memory")]
        public IActionResult GetMemoryUsage()
        {
            var totalPhysicalMemory = _totalPhysicalMemory / (double)1024 / (double)1024;
            var freeMemory = (double)_memory.NextValue();

            return Ok(new
            {
                TotalPhysicalMemory = totalPhysicalMemory,
                FreeMemory = freeMemory
            });
        }

        [HttpGet("system/disks")]
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
                    FreeSpacePercentage = (drive.TotalFreeSpace / (double)drive.TotalSize) * 100,
                    TotalSpace = drive.TotalSize,
                    Type = drive.DriveType.ToString()
                };

                driveInfos.Add(dto);
            }

            return Ok(driveInfos);
        }

        [HttpGet("signalr/trigger")]
        public IActionResult TriggerSignalR()
        {
            return Ok();
        }
    }
}
