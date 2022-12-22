using Jobbr.Server.WebAPI;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Net.Http;
using System.Net.Sockets;
using System.Threading.Tasks;
using Container = SimpleInjector.Container;

namespace Jobbr.Dashboard.Tests
{

    [TestClass]
    public class DashboardBackendTests
    {
        private LoggerFactory _loggerFactory;
        private Container _serviceContainer;

        [TestInitialize]
        public void Startup()
        {
            _loggerFactory = new LoggerFactory();
            _serviceContainer = new Container();
            _serviceContainer.Register<JobbrWebApiConfiguration>();
            _serviceContainer.Register<DashboardConfiguration>();
        }

        [TestMethod]
        public async Task DashboardBackend_Start_ConfigUrlIsAvailable()
        {
            // Arrange
            var config = new DashboardConfiguration
            {
                BackendAddress = $"http://localhost:{TcpPortHelper.NextFreeTcpPort()}"
            };

            var host = new DashboardBackend(_loggerFactory, _serviceContainer, config);
            host.Start();

            // Act
            var response = await new HttpClient().GetAsync(config.BackendAddress + "/config");

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public async Task DashboardBackend_AfterStop_IsNotAvailable()
        {
            // Arrange
            var config = new DashboardConfiguration
            {
                BackendAddress = $"http://localhost:{TcpPortHelper.NextFreeTcpPort()}"
            };

            var host = new DashboardBackend(_loggerFactory, _serviceContainer, config);

            host.Start();
            host.Stop();

            try
            {
                // Act
                await new HttpClient().GetAsync(config.BackendAddress + "/config");
            }
            catch (Exception ex)
            {
                if (ex.InnerException is SocketException == false)
                {
                    // Assert
                    Assert.Fail("Exception thrown was " + ex.InnerException + ", which is not the expected exception");
                }
            }
        }


        [TestMethod]
        [ExpectedException(typeof(InvalidOperationException))]
        public void DashboardBackend_StartedTwice_RaisesException()
        {
            // Arrange
            var config = new DashboardConfiguration
            {
                BackendAddress = $"http://localhost:{TcpPortHelper.NextFreeTcpPort()}"
            };

            var host = new DashboardBackend(_loggerFactory, _serviceContainer, config);

            // Act
            // Assert
            host.Start();
            host.Start();
        }

        [TestMethod]
        public async Task DashboardBackend_AfterDisposal_IsNotAvailable()
        {
            // Arrange
            var config = new DashboardConfiguration
            {
                BackendAddress = $"http://localhost:{TcpPortHelper.NextFreeTcpPort()}"
            };

            var host = new DashboardBackend(_loggerFactory, _serviceContainer, config);

            host.Start();
            host.Dispose();

            try
            {
                // Act
                await new HttpClient().GetAsync(config.BackendAddress + "/config");
            }
            catch (Exception ex)
            {
                if (ex.InnerException is SocketException == false)
                {
                    // Assert
                    Assert.Fail("Exception thrown was " + ex.InnerException + ", which is not the expected exception");
                }
            }
        }
    }
}
