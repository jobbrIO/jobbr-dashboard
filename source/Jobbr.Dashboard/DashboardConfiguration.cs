namespace Jobbr.Dashboard
{
    public class DashboardConfiguration
    {
        public string BackendAddress { get; set; }
        public bool DisableCors { get; set; }
        public bool SoftDeleteJobRunOnRetry { get; set; }
    }
}