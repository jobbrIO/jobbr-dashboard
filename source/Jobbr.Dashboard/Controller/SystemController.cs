using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using Jobbr.Dashboard.Model;
using Microsoft.AspNetCore.Mvc;

namespace Jobbr.Dashboard.Controller
{
    /// <summary>
    /// System controller.
    /// </summary>
    [ApiController]
    public class SystemController : ControllerBase
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

        /// <summary>
        /// Get current CPU load.
        /// </summary>
        /// <returns>Current CPU load as a float.</returns>
        [HttpGet("system/cpu")]
        public IActionResult GetCpuLoad()
        {
            return Ok(Cpu.NextValue());
        }

        /// <summary>
        /// Get current memory usage.
        /// </summary>
        /// <returns>Total physical memory and free memory.</returns>
        [HttpGet("system/memory")]
        public IActionResult GetMemoryUsage()
        {
            var totalPhysicalMemory = TotalPhysicalMemory / 1024D / 1024;
            var freeMemory = (double)Memory.NextValue();

            return Ok(new
            {
                TotalPhysicalMemory = totalPhysicalMemory,
                FreeMemory = freeMemory
            });
        }

        /// <summary>
        /// Get hard drive usage.
        /// </summary>
        /// <returns>Drive information.</returns>
        [HttpGet("system/disks")]
        public IActionResult GetDiskUsage()
        {
            var driveInfos = new List<DiskInfoDto>();

            foreach (var drive in DriveInfo.GetDrives())
            {
                var dto = new DiskInfoDto
                {
                    Name = drive.Name,
                    FreeSpace = drive.AvailableFreeSpace,
                    FreeSpacePercentage = drive.TotalFreeSpace / (double)drive.TotalSize * 100,
                    TotalSpace = drive.TotalSize,
                    Type = drive.DriveType.ToString()
                };

                driveInfos.Add(dto);
            }

            return Ok(driveInfos);
        }

        /// <summary>
        /// Trigger Signal R test endpoint.
        /// </summary>
        /// <returns>Empty Ok.</returns>
        [HttpGet("signalr/trigger")]
        public IActionResult TriggerSignalR()
        {
            return Ok();
        }
    }
}
