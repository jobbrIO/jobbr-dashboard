using System;
using Jobbr.ComponentModel.Registration;

namespace Jobbr.Dashboard
{
    public static class JobbrBuilderExtensions
    {
        public static void AddDashboard(this IJobbrBuilder builder)
        {
            builder.AddDashboard(configuration => { });
        }

        public static void AddDashboard(this IJobbrBuilder builder, Action<DashboardWebApiConfiguration> config)
        {
            var customConfig = new DashboardWebApiConfiguration();

            config(customConfig);

            builder.Add<DashboardWebApiConfiguration>(customConfig);

            builder.Register<IJobbrComponent>(typeof(DashboardBackend));
        }
    }
}
