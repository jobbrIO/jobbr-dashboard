using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace Jobbr.Dashboard.Tests
{

    [TestClass]
    public class ServerRegistrationTests : IntegrationTestBase
    {
        [TestMethod]
        public async Task RegisteredAsComponent_JobbrIsStarted_ConfigurationIsAvailable()
        {
            using (GivenRunningServerWithDashboard())
            {
                var client = new HttpClient();
                var result = await client.GetAsync($"{BackendAddress}/config");

                Assert.AreEqual(HttpStatusCode.OK, result.StatusCode);
            }
        }

        [TestMethod]
        public async Task RegisteredAsComponent_JobbrIsStarted_CanLoadSomeJobs()
        {
            using (GivenRunningServerWithDashboard())
            {
                var client = new HttpClient();

                var result = await client.GetAsync($"{WebapiAddress}/jobs");
                Assert.AreEqual(HttpStatusCode.OK, result.StatusCode);
            }
        }
    }
}
