namespace Jobbr.Dashboard
{
    /// <summary>
    /// Dashboard configuration.
    /// </summary>
    public class DashboardConfiguration
    {
        /// <summary>
        /// Backend address.
        /// </summary>
        public string BackendAddress { get; set; }

        /// <summary>
        /// If cross-origin requests should be disabled.
        /// </summary>
        public bool DisableCors { get; set; }

        /// <summary>
        /// If job run should be soft deleted on retry.
        /// </summary>
        public bool SoftDeleteJobRunOnRetry { get; set; }
    }
}