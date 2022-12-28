using Jobbr.Server.WebAPI;
using Microsoft.AspNetCore.Mvc;

namespace Jobbr.Dashboard.Controller
{
    [ApiController]
    public class ConfigController : ControllerBase
    {
        private readonly JobbrWebApiConfiguration _webApiConfiguration;
        private readonly DashboardConfiguration _dashboardConfiguration;

        public ConfigController(JobbrWebApiConfiguration webApiConfiguration, DashboardConfiguration dashboardConfiguration)
        {
            _webApiConfiguration = webApiConfiguration;
            _dashboardConfiguration = dashboardConfiguration;
        }

        [HttpGet("config")]
        public IActionResult Get()
        {
            return Ok(new
            {
                Api = _webApiConfiguration.BackendAddress,
                _dashboardConfiguration.SoftDeleteJobRunOnRetry
            });
        }
    }
}
