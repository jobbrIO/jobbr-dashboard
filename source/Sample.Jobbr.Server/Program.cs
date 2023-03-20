using System;
using System.IO;
using Jobbr.Dashboard;
using Jobbr.Server.Builder;
using Jobbr.Server.ForkedExecution;
using Jobbr.Server.JobRegistry;
using Jobbr.Server.WebAPI;
using Jobbr.Storage.MsSql;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Sample.Jobbr.Server
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
            const string baseAddress = "http://localhost";
            const string jobRunDirectory = "C:/temp";

            if (Directory.Exists(jobRunDirectory) == false)
            {
                Directory.CreateDirectory(jobRunDirectory);
            }

            var app = CreateHostBuilder(args).Build();
            var loggerFactory = app.Services.GetService<ILoggerFactory>();

            var jobbrBuilder = new JobbrBuilder(loggerFactory);
            jobbrBuilder.AddForkedExecution(config =>
            {
                config.JobRunDirectory = jobRunDirectory;
                config.JobRunnerExecutable = "../../../../Sample.JobRunner/bin/Debug/net6.0/Sample.JobRunner.exe";
                config.MaxConcurrentProcesses = 2;
            });

            jobbrBuilder.AddJobs(loggerFactory, repo =>
            {
                repo.Define(nameof(MinutelyJob), typeof(MinutelyJob).FullName)
                    .WithTrigger("* * * * *", parameters: new { SomeProperty = "foobar" }, validFromDateTimeUtc: new DateTime(2000, 1, 1), validToDateTimeUtc: new DateTime(2100, 1, 1), userId: "ozu", userDisplayName: "olibanjoli")
                    .WithParameter(new
                    {
                        Foo = "Bar",
                        Nested = new
                        {
                            Priority = "High",
                            Comment = "Heyho!"
                        }
                    })
                    .WithTrigger(DateTime.Now.Add(TimeSpan.FromDays(1337)), new { Foo = "bar" }, "ozu", "olibanjoli");

                repo.Define(nameof(MinutelyJob) + "-2", typeof(MinutelyJob).FullName)
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

                repo.Define(nameof(HourlyJob), typeof(HourlyJob).FullName)
                    .WithTrigger("0 * * * *", parameters: new { Name = "Jack Bauer", Unit = "CTU", Skills = "Headshot" })
                    .WithParameter(new
                    {
                        Foo = "Bar",
                        Nested = new
                        {
                            Equipment = "Nuke",
                        }
                    });

                repo.Define(nameof(DailyJob), typeof(DailyJob).FullName)
                    .WithTrigger("0 0 * * *", parameters: new { Name = "Jack Bauer", Unit = "CTU", Skills = "Headshot" })
                    .WithParameter(new
                    {
                        Foo = "Bar",
                        Nested = new
                        {
                            Equipment = "Nuke",
                        }
                    });

                repo.Define(nameof(FailingJob), typeof(FailingJob).FullName)
                    .WithTrigger("*/2 * * * *", parameters: new { SomeProperty = "foobar" })
                    .WithParameter(new
                    {
                        Bla = "Blub",
                        Foo = "Bar"
                    });
            });

            jobbrBuilder.AddWebApi(config => config.BackendAddress = $"{baseAddress}:1339/api");
            jobbrBuilder.AddDashboard(config =>
            {
                config.BackendAddress = $"{baseAddress}:1338";
                config.SoftDeleteJobRunOnRetry = true;
            });

            // jobbrBuilder.AddRavenDbStorage(config =>
            // {
            //    config.Url = "http://localhost:8080/";
            //    config.Database = "Jobbr";
            // });
            jobbrBuilder.AddMsSqlStorage(config =>
            {
                config.ConnectionString = "Data Source=localhost\\SQLExpress;Initial Catalog=JobbrDashboard2;Connect Timeout=5;Integrated Security=True";
                config.CreateTablesIfNotExists = true;
            });

            using (var jobbr = jobbrBuilder.Create())
            {
                jobbr.Start(20000);
                Console.WriteLine();
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine("Jobbr is running. Press Enter to quit");
                Console.ResetColor();
                Console.ReadLine();
            }
        }

        /// <summary>
        /// Create <see cref="IHostBuilder"/>.
        /// </summary>
        /// <param name="args">Host builder arguments.</param>
        /// <returns>New <see cref="IHostBuilder"/>.</returns>
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.AddConsole();
                });
    }
}
