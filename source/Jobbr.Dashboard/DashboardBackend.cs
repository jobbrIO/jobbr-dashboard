using System;
using Jobbr.ComponentModel.Registration;
using Microsoft.Extensions.Logging;
using Microsoft.Owin.Hosting;
using Microsoft.Owin.Hosting.Services;
using Microsoft.Owin.Hosting.Starter;

namespace Jobbr.Dashboard
{
    public class DashboardBackend : IJobbrComponent
    {
        private readonly ILogger _logger;
        private readonly IJobbrServiceProvider _dependencyResolver;
        private readonly DashboardConfiguration _configuration;

        private IDisposable _webHost;

        /// <summary>
        /// Initializes a new instance of the <see cref="DashboardBackend"/> class.
        /// </summary>
        public DashboardBackend(ILoggerFactory loggerFactory, IJobbrServiceProvider dependencyResolver, DashboardConfiguration configuration)
        {
            _dependencyResolver = dependencyResolver;
            _configuration = configuration;
            _logger = loggerFactory.CreateLogger<DashboardBackend>();
        }

        /// <summary>
        /// Start the component
        /// </summary>
        public void Start()
        {
            if (string.IsNullOrWhiteSpace(_configuration.BackendAddress))
            {
                throw new ArgumentException("Unable to start DashboardBackend when no BackendUrl is specified");
            }

            var services = (ServiceProvider) ServicesFactory.Create();
            var options = new StartOptions
            {
                Urls =
                {
                    _configuration.BackendAddress
                },
                AppStartup = typeof(Startup).FullName
            };

            // Pass through the IJobbrServiceProvider to allow Startup-Classes to let them inject this dependency
            services.Add(typeof(IJobbrServiceProvider), () => _dependencyResolver);

            var hostingStarter = services.GetService<IHostingStarter>();
            _webHost = hostingStarter.Start(options);
            
            _logger.LogInformation("Started OWIN-Host for DashboardBackend at '{backendAddress}'", _configuration.BackendAddress);
        }

        public void Stop()
        {
            _logger.LogInformation("Stopping OWIN-Host for Web-Endpoints");

            _webHost?.Dispose();
            _webHost = null;
        }

        public void Dispose()
        {
            _webHost.Dispose();
            _webHost = null;
        }
    }
}
