using System;
using System.Threading;

namespace Sample.Jobbr.Server
{
    public class FailingJob
    {
        public void Run()
        {
            Console.WriteLine("##jobbr[progress percent='25.00']");
            Thread.Sleep(TimeSpan.FromSeconds(3));

            throw new NotImplementedException("damn");
        }
    }
}
