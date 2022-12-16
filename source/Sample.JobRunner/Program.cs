using Jobbr.Runtime;
using Jobbr.Runtime.ForkedExecution;
using Microsoft.Extensions.Logging.Abstractions;
using Sample.Jobbr.Server;

namespace Sample.JobRunner
{
    public class Program
    {
        public static void Main(string[] args)
        { 
            var runtime = new ForkedRuntime(NullLoggerFactory.Instance, new RuntimeConfiguration { JobTypeSearchAssemblies = new[] { typeof(MinutelyJob).Assembly } });

            // Pass the arguments of the forked execution to the runtime
            runtime.Run(args);
        }
    }
}
