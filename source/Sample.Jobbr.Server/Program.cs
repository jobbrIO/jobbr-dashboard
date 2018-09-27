using System;
using Jobbr.Server.Builder;
using Jobbr.Server.ForkedExecution;
using Jobbr.Server.JobRegistry;
using Jobbr.Server.WebAPI;
using Jobbr.Storage.MsSql;

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
                repo.Define(typeof(MinutelyJob).Name, typeof(MinutelyJob).FullName)
                    .WithTrigger("* * * * *", parameters: new { SomeProperty = "foobar" }, validFromDateTimeUtc: new DateTime(2000, 1, 1), validToDateTimeUtc: new DateTime(2100, 1, 1), userId: "ozu", userDisplayName: "olibanjoli")
                    .WithParameter(new
                    {
                        Foo = "Bar",
                        Nested = new
                        {
                            Priority = "High",
                            Comment = "Heyho!"
                        }
                    });

                repo.Define(typeof(MinutelyJob).Name + "-2", typeof(MinutelyJob).FullName)
                    .WithTrigger("* * * * *", parameters: new { SomeProperty = "foobar" }, validFromDateTimeUtc: new DateTime(2000, 1, 1), validToDateTimeUtc: new DateTime(2100, 1, 1), userId: "ozu", userDisplayName: "olibanjoli")
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

            jobbrBuilder.AddWebApi(config => config.BackendAddress = $"{baseAddress}api");
            //jobbrBuilder.AddDashboard(config => config.BackendAddress = $"{baseAddress}");
            //jobbrBuilder.AddRavenDbStorage(config =>
            //{
            //    config.Url = "http://localhost:8080/";
            //    config.Database = "Jobbr";
            //});
            jobbrBuilder.AddMsSqlStorage(config =>
            {
                config.ConnectionString = "Data Source=localhost\\SQLExpress;Initial Catalog=JobbrDashboard;Connect Timeout=5;Integrated Security=True";
                config.CreateTablesIfNotExists = true;
            });

            using (var jobbr = jobbrBuilder.Create())
            {
                jobbr.Start(5000);
                Console.WriteLine();
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine("Jobbr is running. Press Enter to quit");
                Console.ResetColor();
                Console.ReadLine();
            }
        }
    }
}
