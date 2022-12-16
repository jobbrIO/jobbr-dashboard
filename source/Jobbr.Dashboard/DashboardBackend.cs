using System;
using System.Threading.Tasks;
using Jobbr.ComponentModel.Registration;
using Jobbr.Dashboard.Controller;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;

namespace Jobbr.Dashboard
{
    public class DashboardBackend : IJobbrComponent
    {
        private readonly ILogger _logger;
        private readonly IServiceCollection _serviceCollection;
        private readonly DashboardConfiguration _configuration;

        private IDisposable _webHost;
        private WebApplication _webApp;

        /// <summary>
        /// Initializes a new instance of the <see cref="DashboardBackend"/> class.
        /// </summary>
        public DashboardBackend(ILoggerFactory loggerFactory, IServiceCollection serviceCollection, DashboardConfiguration configuration)
        {
            _logger = loggerFactory.CreateLogger<DashboardBackend>();

            _serviceCollection = serviceCollection;
            _configuration = configuration;
        }

        /// <summary>
        /// Start the component.
        /// </summary>
        public void Start()
        {
            if (_webApp != null)
            {
                throw new InvalidOperationException("The server has already been started.");
            }

            if (string.IsNullOrWhiteSpace(_configuration.BackendAddress))
            {
                _logger.LogError("Unable to start DashboardBackend when no backend URL is specified.");
                throw new ArgumentException("Unable to start DashboardBackend when no backend URL is specified.");
            }

            var builder = WebApplication.CreateBuilder();

            foreach (var service in _serviceCollection)
            {
                builder.Services.Add(service);
            }

            // Controllers with endpoints need to be added manually due discovery issues.
            // https://stackoverflow.com/q/73777145
            var mvcBuilder = builder.Services.AddControllers();
            mvcBuilder.AddApplicationPart(typeof(ConfigController).Assembly);
            mvcBuilder.AddApplicationPart(typeof(CronController).Assembly);
            mvcBuilder.AddApplicationPart(typeof(SystemController).Assembly);

            _webApp = builder.Build();
            _webApp.MapControllers();
            
            var manifestEmbeddedProvider = new ManifestEmbeddedFileProvider(typeof(DashboardBackend).Assembly);

            _webApp.UseFileServer(new FileServerOptions
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
            _webApp.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = manifestEmbeddedProvider,
                ServeUnknownFileTypes = true
            });
            _webApp.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            _webApp.Urls.Add(_configuration.BackendAddress);

            Task.FromResult(_webApp.StartAsync());

            _logger.LogInformation("Started web host for DashboardBackend at '{backendAddress}'", _configuration.BackendAddress);
        }

        public void Stop()
        {
            _logger.LogInformation("Stopping web host for Web-Endpoints");

            _webHost?.Dispose();
            _webHost = null;
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            _webHost.Dispose();
            _webHost = null;
        }
    }
}