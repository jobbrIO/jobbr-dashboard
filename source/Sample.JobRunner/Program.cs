using Jobbr.Runtime;
using Jobbr.Runtime.ForkedExecution;
using Sample.Jobbr.Server;

namespace Sample.JobRunner
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Set the default assembly to query for job types
            //var runtime = new ForkedRuntime(new RuntimeConfiguration { JobTypeSearchAssemblies = new [] { typeof(MinutelyJob).Assembly } });

            //// Pass the arguments of the forked execution to the runtime
            //runtime.Run(args);
        }
    }
}
