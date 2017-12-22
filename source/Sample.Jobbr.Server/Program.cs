using System;
using Jobbr.Dashboard.Backend;
using Jobbr.Server.Builder;
using Jobbr.Server.ForkedExecution;
using Jobbr.Server.JobRegistry;
using Jobbr.Server.WebAPI;
using Jobbr.Storage.RavenDB;

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
                    .WithTrigger("* * * * *", parameters: new { SomeProperty = "foobar" }, validFromDateTimeUtc: DateTime.MinValue, validToDateTimeUtc: DateTime.MaxValue)
                    .WithParameter(new
                    {
                        Foo = "Bar",
                        Nested = new
                        {
                            Priority = "High",
                            Comment = "Heyho!"
                        }
                    });

                repo.Define(typeof(HourlyJob).Name, typeof(HourlyJob).FullName)
                    .WithTrigger("0 * * * *", parameters: new {Name = "Jack Bauer", Unit = "CTU", Skills = "Headshot"})
                    .WithParameter(new
                    {
                        Foo = "Bar",
                        Nested = new
                        {
                            Equipment = "Nuke",
                        }
                    });


                repo.Define(typeof(DailyJob).Name, typeof(DailyJob).FullName)
                    .WithTrigger("0 0 * * *", parameters: new { Name = "Jack Bauer", Unit = "CTU", Skills = "Headshot" })
                    .WithParameter(new
                    {
                        Foo = "Bar",
                        Nested = new
                        {
                            Equipment = "Nuke",
                        }
                    });

                repo.Define(typeof(FailingJob).Name, typeof(FailingJob).FullName)
                    .WithTrigger("*/5 * * * *", parameters: new {SomeProperty = "foobar"})
                    .WithParameter(new
                    {
                        Bla = "Blub",
                        Foo = "Bar"
                    });
            });

            jobbrBuilder.AddWebApi(config => config.BackendAddress = baseAddress);
            jobbrBuilder.AddDashboard(config => config.BackendAddress = $"{baseAddress}dashboard");
            jobbrBuilder.AddRavenDbStorage(config =>
            {
                config.Url = "http://localhost:8080/";
                config.Database = "Jobbr";
            });

            using (var jobbr = jobbrBuilder.Create())
            {
                jobbr.Start(TimeSpan.FromSeconds(20).Milliseconds);
                Console.WriteLine();
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine("Press Enter to exit");
                Console.ResetColor();
                Console.ReadLine();
            }
        }
    }
}
