using System;
using System.IO;
using System.Threading;

namespace Sample.Jobbr.Server
{
    public class FailingJob
    {
        public void Run()
        {
            Console.WriteLine("##jobbr[progress percent='25.00']");
            File.WriteAllText("damn.txt", "shit happens");
            Thread.Sleep(TimeSpan.FromSeconds(3));

            throw new NotImplementedException("damn");
        }
    }
}
