using System.IO;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using Jobbr.ComponentModel.Registration;
using Microsoft.Owin.Cors;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Owin;

namespace Jobbr.Dashboard.Backend
{
    public class Startup
    {
        /// <summary>
        /// The dependency resolver from the JobbrServer which needs to be passed through the OWIN stack to WebAPI
        /// </summary>
        private readonly IJobbrServiceProvider dependencyResolver;

        public Startup(IJobbrServiceProvider serviceProvider)
        {
            //if (serviceProvider == null)
            //{
            //    throw new ArgumentException("Please provide a service provider. See http://servercoredump.com/question/27246240/inject-current-user-owin-host-web-api-service for details", nameof(serviceProvider));
            //}

            //this.dependencyResolver = serviceProvider;
        }

        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration
            {
                //DependencyResolver = new DependencyResolverAdapter(this.dependencyResolver)
            };

            config.MapHttpAttributeRoutes();

            var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);
            config.EnableCors(new EnableCorsAttribute("*", "*", "*"));

            var jsonSerializerSettings = new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver(), NullValueHandling = NullValueHandling.Ignore };
            config.Formatters.JsonFormatter.SerializerSettings = jsonSerializerSettings;

            app.UseWebApi(config);

#if DEBUG
            app.UseCors(CorsOptions.AllowAll);
#endif

            var assemblyLocation = new FileInfo(typeof(Startup).Assembly.Location);
            var appPath = Path.Combine(assemblyLocation.Directory.Parent.Parent.FullName, "app");

            var directory = new DirectoryInfo(appPath);

            IFileSystem fileSystem;

            if (directory.Exists)
            {
                // looks like we are installed as nuget --> serve the files from the app folder
                fileSystem = new PhysicalFileSystem(appPath);
            }
            else
            {
                // app folder not found. most likely were not installed as nuget package. trying to run 
                fileSystem = new PhysicalFileSystem("../../../Jobbr.Dashboard.Frontend/jobbr-dashboard/dist");
            }

            var options = new FileServerOptions
            {
                EnableDefaultFiles = true,
                FileSystem = fileSystem,
                StaticFileOptions =
                {
                    FileSystem = fileSystem,
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
