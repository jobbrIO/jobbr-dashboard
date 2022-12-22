using Jobbr.Server;
using Jobbr.Server.Builder;
using Jobbr.Server.WebAPI;
using Microsoft.Extensions.Logging.Abstractions;

namespace Jobbr.Dashboard.Tests;

public class IntegrationTestBase
{
    public string WebapiAddress { get; private set; }
    public string BackendAddress { get; private set; }

    protected JobbrServer GivenRunningServerWithDashboard()
    {
        WebapiAddress = $"http://localhost:{TcpPortHelper.NextFreeTcpPort()}";
        BackendAddress = $"http://localhost:{TcpPortHelper.NextFreeTcpPort()}";

        var builder = new JobbrBuilder(new NullLoggerFactory());

        builder.AddWebApi(conf => conf.BackendAddress = WebapiAddress);
        builder.AddDashboard(conf => conf.BackendAddress = BackendAddress);

        var server = builder.Create();

        server.Start();

        return server;
    }
}