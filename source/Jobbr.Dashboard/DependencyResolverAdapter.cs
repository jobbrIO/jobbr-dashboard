using System;
using System.Collections.Generic;
using System.Web.Http.Dependencies;
using Jobbr.ComponentModel.Registration;

namespace Jobbr.Dashboard
{
    public class DependencyResolverAdapter : IDependencyResolver
    {
        private readonly IJobbrServiceProvider _serviceProvider;

        public DependencyResolverAdapter(IJobbrServiceProvider serviceProvider)
        {
            this._serviceProvider = serviceProvider;
        }

        public void Dispose()
        {
        }

        public object GetService(Type serviceType)
        {
            return this._serviceProvider.GetService(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return this._serviceProvider.GetServices(serviceType);
        }

        public IDependencyScope BeginScope()
        {
            return new DependencyResolverAdapter(this._serviceProvider.GetChild());
        }
    }
}
