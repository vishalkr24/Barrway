using Microsoft.AspNetCore.SignalR;

namespace Barrway.WebSocket.Hubs
{
    public class QueueManager: Hub
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
