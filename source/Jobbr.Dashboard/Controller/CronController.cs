using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NCrontab;

namespace Jobbr.Dashboard.Controller
{
    [ApiController]
    public class CronController : ControllerBase
    {
        [HttpGet("cron/")]
        public async Task<IActionResult> Validate(string cron)
        {
            var parsed = CrontabSchedule.TryParse(cron);

            return Ok(new { ParseSuccess = parsed != null });
        }
    }
}
