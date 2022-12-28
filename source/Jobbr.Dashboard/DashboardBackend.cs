using Jobbr.ComponentModel.Registration;
using Jobbr.Dashboard.Controller;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using SimpleInjector;
using System;
using System.Threading.Tasks;

namespace Jobbr.Dashboard
{
    public class DashboardBackend : IJobbrComponent
    {
        private IWebHost _webHost;
        private readonly ILogger _logger;
        private readonly InstanceProducer[] _serviceContainer;
        private readonly DashboardConfiguration _configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="DashboardBackend"/> class.
        /// </summary>
        public DashboardBackend(ILoggerFactory loggerFactory, Container serviceContainer, DashboardConfiguration configuration)
        {
            _logger = loggerFactory.CreateLogger<DashboardBackend>();
            _serviceContainer = serviceContainer.GetCurrentRegistrations();
            _configuration = configuration;
        }

        /// <summary>
        /// Start the component.
        /// </summary>
        public void Start()
        {
            if (_webHost != null)
            {
                throw new InvalidOperationException("The server has already been started.");
            }

            if (string.IsNullOrWhiteSpace(_configuration.BackendAddress))
            {
                throw new ArgumentException("Unable to start DashboardBackend when no backend URL is specified.", nameof(_configuration.BackendAddress));
            }

            _webHost = new WebHostBuilder()
                .UseKestrel()
                .UseUrls(new Uri(_configuration.BackendAddress).GetLeftPart(UriPartial.Authority))
                .ConfigureServices(services =>
                {
                    foreach (var instanceProducer in _serviceContainer)
                    {
                        services.Add(
                            new ServiceDescriptor(instanceProducer.ServiceType, instanceProducer.GetInstance()));
                    }

                    // Controllers with endpoints need to be added manually due to discovery issues.
                    // https://stackoverflow.com/q/73777145
                    services.AddControllers()
                        .AddApplicationPart(typeof(ConfigController).Assembly)
                        .AddApplicationPart(typeof(CronController).Assembly)
                        .AddApplicationPart(typeof(SystemController).Assembly);
                })
                .Configure(app =>
                {
                    var manifestEmbeddedProvider = new ManifestEmbeddedFileProvider(typeof(DashboardBackend).Assembly);

                    app.UseFileServer(new FileServerOptions
                    {
                        EnableDefaultFiles = true,
                        FileProvider = manifestEmbeddedProvider,
                        DefaultFilesOptions =
                        {
                            DefaultFileNames = new []
                            {
                                "index.html"
                            }
                        }
                    });

                    app.UseStaticFiles(new StaticFileOptions
                    {
                        FileProvider = manifestEmbeddedProvider,
                        ServeUnknownFileTypes = true
                    });

                    app.UseRouting();

                    app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllers();
                    });
                })
                .Build();

            _webHost.Start();

            _logger.LogInformation("Started web host for DashboardBackend at '{backendAddress}'", _configuration.BackendAddress);
        }

        public void Stop()
        {
            _logger.LogInformation("Stopping web host for Web-Endpoints");

            Task.FromResult(_webHost.StopAsync());
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            Dispose(true);
        }

        /// <summary>
        /// Conditional web host dispose.
        /// </summary>
        /// <param name="disposing">If true, dispose.</param>
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                Task.Run(async () => await _webHost.StopAsync());
                _webHost?.Dispose();
            }
        }
    }
}