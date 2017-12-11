using System;
using Jobbr.Dashboard.Backend;
using Microsoft.Owin.Hosting;

namespace Jobbr.Dashboard.Playground
{
    public class Program
    {
        public static void Main(string[] args)
        {
            const string baseAddress = "http://localhost:1338/";

            using (WebApp.Start<Startup>(baseAddress))
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("REST API started at " + baseAddress);
                Console.ResetColor();
                Console.WriteLine("Press enter to terminate");
                Console.ReadLine();
            }
        }
    }
}
