using Microsoft.AspNetCore.Mvc;
using NCrontab;

namespace Jobbr.Dashboard.Controller
{
    public class CronController : ControllerBase
    {
        [HttpGet]
        [Route("cron/")]
        public IActionResult Validate(string cron)
        {
            var parsed = CrontabSchedule.TryParse(cron);

            return Ok(new { ParseSuccess = parsed != null });
        }
    }
}
