using System.Web.Http;
using Jobbr.Server.WebAPI;

namespace Jobbr.Dashboard.Controller
{
    public class ConfigController : ApiController
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
        public IHttpActionResult Get()
        {
            return this.Ok(new
            {
                Api = webApiConfiguration.BackendAddress,
                dashboardConfiguration.SoftDeleteJobRunOnRetry
            });
        }
    }
}
