using Barrway.DTO.Common;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
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
        private readonly QueueService queueService = new QueueService(new SqlFunction());

        public void Send(string name, string message)
        {
            Clients.All.addNewMessageToPage(name, message);
        }

        public async Task<AddUpdateDelete> getSessionList(string CalendarCode, string CompanyCode)
        {
            try
            {
                var result = await queueService.getSessionList(CalendarCode, CompanyCode);

                if (result.Status)
                {
                    Clients.Client(Context.ConnectionId).updateSessions(result);
                }
                else
                {
                    Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch sessions."});
                }
                
            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch sessions." });
            }

            return null;
        }



    }
}