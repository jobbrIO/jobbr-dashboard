using System;
using System.Linq;
using System.Web.Http;
using Jobbr.ComponentModel.Registration;
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

            app.UseWebApi(config);
            //app.MapSignalR();
        }
    }
}
