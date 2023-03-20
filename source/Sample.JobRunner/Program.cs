using Jobbr.Runtime;
using Jobbr.Runtime.ForkedExecution;
using Microsoft.Extensions.Logging.Abstractions;
using Sample.Jobbr.Server;

namespace Sample.JobRunner
{
    /// <summary>
    /// Program.
    /// </summary>
    public class Program
    {
        /// <summary>
        /// Main entry point.
        /// </summary>
        /// <param name="args">Execution arguments.</param>
        public static void Main(string[] args)
        {
            var runtime = new ForkedRuntime(NullLoggerFactory.Instance, new RuntimeConfiguration { JobTypeSearchAssemblies = new[] { typeof(MinutelyJob).Assembly } });

            // Pass the arguments of the forked execution to the runtime
            runtime.Run(args);
        }
    }
}
