﻿using System;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using Jobbr.ComponentModel.Registration;
using Microsoft.Owin.Cors;
using Microsoft.Owin.StaticFiles;
using Owin;
using SharpFileSystem.SharpZipLib;

namespace Jobbr.Dashboard
{
    public class Startup
    {
        private readonly IJobbrServiceProvider _dependencyResolver;

        public Startup(IJobbrServiceProvider serviceProvider)
        {
            _dependencyResolver = serviceProvider;
        }

        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            config.DependencyResolver = new DependencyResolverAdapter(_dependencyResolver);

            ConfigureWebApi(app, config);

            ConfigureStaticFilesHosting(app);
        }

        private void ConfigureWebApi(IAppBuilder app, HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            var dashboardConfig = (DashboardConfiguration)_dependencyResolver.GetService(typeof(DashboardConfiguration));

            var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);

            if (dashboardConfig.DisableCors == false)
            {
                config.EnableCors(new EnableCorsAttribute("*", "*", "*"));
            }

            app.UseWebApi(config);

            if (dashboardConfig.DisableCors == false)
            {
                app.UseCors(CorsOptions.AllowAll);
            }
        }

        private static void ConfigureStaticFilesHosting(IAppBuilder app)
        {
            const string appZipResource = "dashboard-app.zip";

            var appZipEmbeddedResourceName = Assembly.GetEntryAssembly().GetManifestResourceNames().FirstOrDefault(p => p.EndsWith(appZipResource));

            if (appZipEmbeddedResourceName == null)
            {
                throw new NullReferenceException("Could not find dashboard-app.zip in the entry assembly. Please make sure dashboard-app.zip is included in your jobbr server project and build action is set to Embedded Resource");
            }

            var stream = Assembly.GetEntryAssembly().GetManifestResourceStream(appZipEmbeddedResourceName);
            var zipFileSystem = SharpZipLibFileSystem.Open(stream);

            var wrapper = new FileSystemWrapper(zipFileSystem);

            var options = new FileServerOptions
            {
                EnableDefaultFiles = true,
                FileSystem = wrapper,
                StaticFileOptions =
                    {
                        FileSystem = wrapper,
                        ServeUnknownFileTypes = true
                    },
                DefaultFilesOptions =
                    {
                        DefaultFileNames = new[]
                        {
                            "index.html"
                        }
                    }
            };

            app.UseFileServer(options);
        }
    }
}

