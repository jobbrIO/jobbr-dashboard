using System;
using Jobbr.Dashboard.Backend;
using Jobbr.Server.Builder;
using Jobbr.Server.ForkedExecution;
using Jobbr.Server.JobRegistry;
using Jobbr.Server.WebAPI;

namespace Sample.Jobbr.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            const string baseAddress = "http://localhost:1338/";

            var jobbrBuilder = new JobbrBuilder();
            jobbrBuilder.AddForkedExecution(config =>
            {
                config.JobRunDirectory = "c:/temp";
                config.JobRunnerExecutable = "../../../Sample.JobRunner/bin/Debug/Sample.JobRunner.exe";
                config.MaxConcurrentProcesses = 1;
            });

            jobbrBuilder.AddJobs(repo =>
            {
                repo.Define(typeof(MinutelyJob).Name, typeof(MinutelyJob).FullName) // why no assembly overload?
                    .WithTrigger("* * * * *", parameters: new { SomeProperty = "foobar" })
                    .WithParameter(new
                    {
                        Foo = "Bar",
                        Nested = new
                        {
                            Priority = "High",
                            Comment = "Heyho!"
                        }
                    });
            });

            jobbrBuilder.AddWebApi(config => config.BackendAddress = baseAddress);
            jobbrBuilder.AddDashboard(config => config.BackendAddress = $"{baseAddress}dashboard");

            using (var jobbr = jobbrBuilder.Create())
            {
                jobbr.Start();
                Console.WriteLine();
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine("Press Enter to exit");
                Console.ResetColor();
                Console.ReadLine();
            }
        }
    }
}
