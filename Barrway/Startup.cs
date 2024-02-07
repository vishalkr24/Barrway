using Barrway.WebSocket;
using Microsoft.Owin;
using Owin;
using System;
using System.Threading.Tasks;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;

[assembly: OwinStartup(typeof(Barrway.Startup))]

namespace Barrway
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
            ConfigureAuth(app);
            
            // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
        }
    }
}
