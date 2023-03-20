using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Jobbr.ComponentModel.Registration;
using Jobbr.Dashboard.Controller;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using SimpleInjector;

namespace Jobbr.Dashboard;

/// <summary>
///     The dashboard server backend.
/// </summary>
public class DashboardBackend : IJobbrComponent
{
    private readonly DashboardConfiguration _configuration;
    private readonly ILogger _logger;
    private readonly InstanceProducer[] _serviceContainer;

    private static IFileProvider _virtualFileSystemProvider;
    private IWebHost _webHost;

    /// <summary>
    ///     Initializes a new instance of the <see cref="DashboardBackend" /> class.
    /// </summary>
    public DashboardBackend(ILoggerFactory loggerFactory, Container serviceContainer, DashboardConfiguration configuration)
    {
        _logger = loggerFactory.CreateLogger<DashboardBackend>();
        _serviceContainer = serviceContainer.GetCurrentRegistrations();
        _configuration = configuration;

        const string appZipResource = "dashboard-app.zip";

        var assembly = Assembly.GetExecutingAssembly();
        var dashboardZipEmbeddedResourceName = assembly.GetManifestResourceNames().FirstOrDefault(p => p.EndsWith(appZipResource));

        if (dashboardZipEmbeddedResourceName == null)
        {
            throw new NullReferenceException("Could not find dashboard-app.zip in the entry assembly. Please make sure dashboard-app.zip is included in your jobbr server project and build action is set to Embedded Resource");
        }

        var zipStream = assembly.GetManifestResourceStream(dashboardZipEmbeddedResourceName);

        if (_virtualFileSystemProvider == null)
        {
            _virtualFileSystemProvider = new ZipFileContentProvider(zipStream);
        }
    }

    /// <summary>
    ///     Start the component.
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
                    services.Add(new ServiceDescriptor(instanceProducer.ServiceType, instanceProducer.GetInstance()));
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
                app.UseRouting();

                app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

                app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

                app.UseFileServer(new FileServerOptions
                {
                    EnableDefaultFiles = true,
                    FileProvider = _virtualFileSystemProvider,
                    StaticFileOptions =
                    {
                        FileProvider = _virtualFileSystemProvider,
                        ServeUnknownFileTypes = true
                    },
                    DefaultFilesOptions =
                    {
                        DefaultFileNames = new[]
                        {
                            "index.html"
                        }
                    }
                });
            })
            .Build();

        _webHost.Start();

        _logger.LogInformation("Started web host for DashboardBackend at '{backendAddress}'", _configuration.BackendAddress);
    }

    /// <summary>
    ///     Stop web host.
    /// </summary>
    public void Stop()
    {
        _logger.LogInformation("Stopping web host for Web-Endpoints");

        Task.FromResult(_webHost.StopAsync());
    }

    /// <summary>
    ///     Dispose web host.
    /// </summary>
    public void Dispose()
    {
        GC.SuppressFinalize(this);
        Dispose(true);
    }

    /// <summary>
    ///     Conditional web host dispose.
    /// </summary>
    /// <param name="disposing">If true, dispose.</param>
    private void Dispose(bool disposing)
    {
        if (disposing)
        {
            Task.Run(async () => await _webHost.StopAsync());
            _webHost?.Dispose();
        }
    }
}