using System.Web.Http;
using Jobbr.Server.WebAPI;

namespace Jobbr.Dashboard.Controller
{
    public class ConfigController : ApiController
    {
        private readonly JobbrWebApiConfiguration webApiConfiguration;

        public ConfigController(JobbrWebApiConfiguration webApiConfiguration)
        {
            this.webApiConfiguration = webApiConfiguration;
        }

        [HttpGet]
        [Route("config")]
        public IHttpActionResult Get()
        {
            return this.Ok(new
            {
                Api = webApiConfiguration.BackendAddress,
            });
        }
    }
}
