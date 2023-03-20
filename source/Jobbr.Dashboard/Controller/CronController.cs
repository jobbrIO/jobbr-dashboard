using Microsoft.AspNetCore.Mvc;
using NCrontab;

namespace Jobbr.Dashboard.Controller
{
    /// <summary>
    /// CRON controller.
    /// </summary>
    [ApiController]
    public class CronController : ControllerBase
    {
        /// <summary>
        /// Validate that CRON expression is parseable.
        /// </summary>
        /// <param name="cron">CRON expression to validate.</param>
        /// <returns>If CRON expression is parseable.</returns>
        [HttpGet("cron/")]
        public IActionResult Validate(string cron)
        {
            var parsed = CrontabSchedule.TryParse(cron);

            return Ok(new { ParseSuccess = parsed != null });
        }
    }
}
