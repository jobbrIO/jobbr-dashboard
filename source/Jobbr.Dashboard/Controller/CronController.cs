using System.Web.Http;
using NCrontab;

namespace Jobbr.Dashboard.Controller
{
    public class CronController : ApiController
    {
        [HttpGet]
        [Route("cron/{cron}")]
        public IHttpActionResult Validate(string cron)
        {
            var parsed = CrontabSchedule.TryParse(cron);

            return Ok(new { ParseSuccess = parsed != null });
        }
    }
}
