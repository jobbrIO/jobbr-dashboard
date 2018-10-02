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

        public static void AddDashboard(this IJobbrBuilder builder, Action<DashboardConfiguration> config)
        {
            var customConfig = new DashboardConfiguration();

            config(customConfig);

            builder.Add<DashboardConfiguration>(customConfig);

            builder.Register<IJobbrComponent>(typeof(DashboardBackend));
        }
    }
}
