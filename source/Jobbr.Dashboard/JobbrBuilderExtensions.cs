using System;
using Jobbr.ComponentModel.Registration;

namespace Jobbr.Dashboard
{
    /// <summary>
    /// Extension methods for <see cref="IJobbrBuilder"/>.
    /// </summary>
    public static class JobbrBuilderExtensions
    {
        /// <summary>
        /// Add dashboard without specific configuration.
        /// </summary>
        /// <param name="builder">Target <see cref="IJobbrBuilder"/>.</param>
        public static void AddDashboard(this IJobbrBuilder builder)
        {
            builder.AddDashboard(_ => { });
        }

        /// <summary>
        /// Add dashboard with specific configuration.
        /// </summary>
        /// <param name="builder">Target <see cref="IJobbrBuilder"/>.</param>
        /// <param name="config">Configuration.</param>
        public static void AddDashboard(this IJobbrBuilder builder, Action<DashboardConfiguration> config)
        {
            var customConfig = new DashboardConfiguration();

            config(customConfig);

            builder.Add<DashboardConfiguration>(customConfig);

            builder.RegisterForCollection<IJobbrComponent>(typeof(DashboardBackend));
        }
    }
}
