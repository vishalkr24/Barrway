using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Barrway.WebSocket
{
    public class QueueManager : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}