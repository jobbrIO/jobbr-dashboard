using System;
using System.IO;
using System.Threading;

namespace Sample.Jobbr.Server
{
    /// <summary>
    /// Job that is run hourly.
    /// </summary>
    public class HourlyJob
    {
        /// <summary>
        /// Run job.
        /// </summary>
        public void Run()
        {
            const int iterations = 20;

            for (var i = 0; i < iterations; i++)
            {
                Thread.Sleep(TimeSpan.FromSeconds(1));

                Console.WriteLine("##jobbr[progress percent='{0:0.00}']", (double)(i + 1) / iterations * 100);
            }

            File.AppendAllText("hourly-job-artifact.txt", "lorem ipsum");
        }
    }
}