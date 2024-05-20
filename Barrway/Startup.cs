using Barrway.WebSocket;
using Microsoft.Owin;
using Owin;
using System;
using System.Threading.Tasks;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Microsoft.AspNet.SignalR.Infrastructure;
using Barrway.Service.Repository;
using Barrway.Service.IRepository;

[assembly: OwinStartup(typeof(Barrway.Startup))]

namespace Barrway
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.Map("/signalr", map =>
            {
                map.UseCors(CorsOptions.AllowAll);
                var hubConfig = new HubConfiguration
                {
                    EnableDetailedErrors = true
                };
                map.RunSignalR(hubConfig);
            });

            app.UseCors(CorsOptions.AllowAll);
            
        }
    }
}
