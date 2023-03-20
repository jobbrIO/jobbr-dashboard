using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Shouldly;

namespace Jobbr.Dashboard.Tests
{
    [TestClass]
    public class ServerRegistrationTests : IntegrationTestBase
    {
        [TestMethod]
        public async Task RegisteredAsComponent_JobbrIsStarted_ConfigurationIsAvailable()
        {
            // Arrange
            using (CreateTestJobServer())
            {
                var client = new HttpClient();

                // Act
                var result = await client.GetAsync($"{BackendAddress}/config");

                // Assert
                result.StatusCode.ShouldBe(HttpStatusCode.OK);
            }
        }

        [TestMethod]
        public async Task RegisteredAsComponent_JobbrIsStarted_CanLoadSomeJobs()
        {
            // Arrange
            using (CreateTestJobServer())
            {
                var client = new HttpClient();

                // Act
                var result = await client.GetAsync($"{WebApiAddress}/jobs");

                // Assert
                result.StatusCode.ShouldBe(HttpStatusCode.OK);
            }
        }
    }
}
