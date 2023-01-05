using Jobbr.Server.WebAPI;
using Microsoft.AspNetCore.Mvc;

namespace Jobbr.Dashboard.Controller
{
    /// <summary>
    /// Configuration controller.
    /// </summary>
    [ApiController]
    public class ConfigController : ControllerBase
    {
        private readonly JobbrWebApiConfiguration _webApiConfiguration;
        private readonly DashboardConfiguration _dashboardConfiguration;

        /// <summary>
        /// Initializes a new instance of the <see cref="ConfigController"/> class.
        /// </summary>
        /// <param name="webApiConfiguration">Jobbr API configuration.</param>
        /// <param name="dashboardConfiguration">Dashboard configuration.</param>
        public ConfigController(JobbrWebApiConfiguration webApiConfiguration, DashboardConfiguration dashboardConfiguration)
        {
            _webApiConfiguration = webApiConfiguration;
            _dashboardConfiguration = dashboardConfiguration;
        }

        /// <summary>
        /// Get current API configuration.
        /// </summary>
        /// <returns>Action result that contains the API configuration.</returns>
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
