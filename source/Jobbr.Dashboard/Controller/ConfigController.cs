using Jobbr.Server.WebAPI;
using Microsoft.AspNetCore.Mvc;

namespace Jobbr.Dashboard.Controller
{
    public class ConfigController : ControllerBase
    {
        private readonly JobbrWebApiConfiguration webApiConfiguration;
        private readonly DashboardConfiguration dashboardConfiguration;

        public ConfigController(JobbrWebApiConfiguration webApiConfiguration, DashboardConfiguration dashboardConfiguration)
        {
            this.webApiConfiguration = webApiConfiguration;
            this.dashboardConfiguration = dashboardConfiguration;
        }

        [HttpGet]
        [Route("config")]
        public IActionResult Get()
        {
            return Ok(new
            {
                Api = webApiConfiguration.BackendAddress,
                dashboardConfiguration.SoftDeleteJobRunOnRetry
            });
        }
    }
}
