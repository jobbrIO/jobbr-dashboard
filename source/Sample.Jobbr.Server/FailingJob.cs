using System;
using System.IO;
using System.Threading;

namespace Sample.Jobbr.Server
{
    /// <summary>
    /// A failing job.
    /// </summary>
    public class FailingJob
    {
        /// <summary>
        /// Run the failing job.
        /// </summary>
        /// <exception cref="NotImplementedException">Always throws.</exception>
        public void Run()
        {
            Console.WriteLine("##jobbr[progress percent='25.00']");
            File.WriteAllText("damn.txt", "shit happens");
            Thread.Sleep(TimeSpan.FromSeconds(3));

            throw new NotImplementedException("damn");
        }
    }
}
