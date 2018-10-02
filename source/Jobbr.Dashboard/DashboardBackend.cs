using System;
using Jobbr.ComponentModel.Registration;
using Jobbr.Dashboard.Logging;
using Microsoft.Owin.Hosting;
using Microsoft.Owin.Hosting.Services;
using Microsoft.Owin.Hosting.Starter;

namespace Jobbr.Dashboard
{
    public class DashboardBackend : IJobbrComponent
    {
        private static readonly ILog Logger = LogProvider.For<DashboardBackend>();

        private readonly IJobbrServiceProvider dependencyResolver;

        /// <summary>
        /// The webhost that serves for the OWIN WebAPI component
        /// </summary>
        private IDisposable webHost;

        private readonly DashboardConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="DashboardBackend"/> class.
        /// </summary>
        public DashboardBackend(IJobbrServiceProvider dependencyResolver, DashboardConfiguration configuration)
        {
            this.dependencyResolver = dependencyResolver;
            this.configuration = configuration;
        }

        /// <summary>
        /// Start the component
        /// </summary>
        public void Start()
        {
            if (string.IsNullOrWhiteSpace(this.configuration.BackendAddress))
            {
                throw new ArgumentException("Unable to start DashboardBackend when no BackendUrl is specified");
            }

            var services = (ServiceProvider) ServicesFactory.Create();
            var options = new StartOptions
            {
                Urls =
                {
                    this.configuration.BackendAddress
                },
                AppStartup = typeof(Startup).FullName
            };

            // Pass through the IJobbrServiceProvider to allow Startup-Classes to let them inject this dependency
            services.Add(typeof(IJobbrServiceProvider), () => this.dependencyResolver);

            var hostingStarter = services.GetService<IHostingStarter>();
            this.webHost = hostingStarter.Start(options);

            Logger.InfoFormat($"Started OWIN-Host for DashboardBackend at '{this.configuration.BackendAddress}'.");
        }

        public void Stop()
        {
            Logger.InfoFormat("Stopping OWIN-Host for Web-Endpoints'");

            this.webHost?.Dispose();

            this.webHost = null;
        }

        public void Dispose()
        {
            this.webHost.Dispose();
            this.webHost = null;
        }
    }
}
