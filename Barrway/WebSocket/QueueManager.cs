using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using Barrway.Security;
using Barrway.Service.IRepository;
using Barrway.Service.Repository;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Security.Principal;


namespace Barrway.WebSocket
{
    public class QueueManager : Hub
    {
        private readonly QueueService queueService = new QueueService(new SqlFunction(), new FormAPIRepository());

        public async override Task OnConnected()
        {
            Clients.Client(Context.ConnectionId).showSuccessResult(new AddUpdateDelete() { Status = true, Message = "Updating Live." });
            await base.OnConnected();
        }

        public async override Task OnDisconnected(bool stopCalled)
        {
            Clients.Client(Context.ConnectionId).showSuccessResult(new AddUpdateDelete() { Status = true, Message = "Not Updating Live" });
            await base.OnDisconnected(stopCalled);
        }

        #region admin functions
        public async Task getSessionList(string CalendarCode, string CompanyCode)
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
                    Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch sessions." });
                }

            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch sessions." });
            }

            await Task.CompletedTask;
        }

        public async Task getCurrentSession(string CalendarCode, string CompanyCode)
        {
            try
            {
                var result = await queueService.getCurrentSession(CalendarCode, CompanyCode);

                if (result.Status)
                {
                    Clients.Client(Context.ConnectionId).updateCurrentSession(result);
                }
                else
                {
                    Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch sessions." });
                }

            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch sessions." });
            }

            await Task.CompletedTask;
        }

        public async Task getQueueList(string CalendarCode, string CompanyCode, bool AllClients = false, bool ByDate = false)
        {
            try
            {
                var result = await queueService.getQueueList(CalendarCode, CompanyCode, ByDate);

                if (result.Status)
                {
                    if (AllClients)
                    {
                        Clients.All.updateQueues(result);
                    }
                    else
                    {
                        Clients.Client(Context.ConnectionId).updateQueues(result);
                    }
                    
                }
                else
                {
                    Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch queues." });
                }

            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch queues." });
            }

            await Task.CompletedTask;
        }

        public async Task getQueueTicketList(string CalendarCode = null, string CompanyCode = null, string QueueIds = null, bool AllClients = false)
        {
            try
            {
                var result = await queueService.getQueueTicketList(CalendarCode, CompanyCode, QueueIds);

                if (result.Status)
                {
                    if (AllClients)
                    {
                        Clients.All.updateQueueTicketList(result);
                    }
                    else
                    {
                        Clients.Client(Context.ConnectionId).updateQueueTicketList(result);
                    }

                }
                else
                {
                    Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch tickets." });
                }

            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch queues." });
            }

            await Task.CompletedTask;
        }

        public async Task updateQueueActivationStatus(string QueueId, string Status)
        {
            try
            {
                var result = await queueService.updateQueueActivationStatus(QueueId, Status);

                if (result.Status)
                {
                    Clients.Client(Context.ConnectionId).showSuccessResult(new AddUpdateDelete() { Status = true, Message = "Queue ticket distribution" + ((Status == "Y") ? " is started." : " is turned off.") });
                }
                else
                {
                    Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to update queue status." });
                }

            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to update queue status." });
            }

            await Task.CompletedTask;
        }
        #endregion

        #region marketplace functions
        public async Task getMarketplaceQueueList(string CalendarCode, string CompanyCode, bool AllClients = false)
        {
            try
            {
                var result = await queueService.getMarketplaceQueueList(CalendarCode, CompanyCode);

                if (result.Status)
                {
                    if (AllClients)
                    {
                        Clients.All.updateMarketplaceQueues(result);
                    }
                    else
                    {
                        Clients.Client(Context.ConnectionId).updateMarketplaceQueues(result);
                    }
                    
                }
                else
                {
                    Clients.Client(Context.ConnectionId).showMarketplaceErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch queues." });
                }

            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showMarketplaceErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to fetch queues." });
            }

            await Task.CompletedTask;

        }

        public async Task bookTicket(TicketMasterModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.USER_ID) || model.USER_ID == "null")
                {
                    Clients.Client(Context.ConnectionId).showMarketplaceErrorResult(new AddUpdateDelete() { Status = false, Message = "Please login to book a ticket." });
                    await Task.CompletedTask;
                }
                else
                {
                    var result = await queueService.bookTicket(model);

                    if (result.Status)
                    {
                        Clients.Client(Context.ConnectionId).showMarketplaceResult(result);
                        await getQueueTicketList(result.Data["CALENDAR_CODE"]?.ToString(), result.Data["COMPANY_CODE"]?.ToString(), null, true);
                    }
                    else
                    {
                        if (result.Data != null)
                        {
                            result.Data = model;
                            Clients.Client(Context.ConnectionId).bookTicketConfirmation(result);
                        }
                        else
                        {
                            result.Data = model;
                            Clients.Client(Context.ConnectionId).showMarketplaceErrorResult(result);
                        }

                    }
                }
                
               

            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showMarketplaceErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to book ticket" });
            }

            await Task.CompletedTask;
        }

        public async Task updateQueueTicketStatus(TicketMasterModel model)
        {
            try
            {
                model.USER_ID = UserIdentity.UserID;
                var result = await queueService.updateQueueTicketPosition(model);

                if (result.Status)
                {
                    Clients.Client(Context.ConnectionId).updateMarketplaceQueueTicketStatus(result);
                }
                else
                {
                    Clients.Client(Context.ConnectionId).showMarketplaceErrorResult(result);
                }

            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showMarketplaceErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to upadate status" });
            }

            await Task.CompletedTask;
        }

        public async Task callNext(string QueueId)
        {
            try
            {
                var result = await queueService.callNext(QueueId);

                if (result.Status)
                {
                    await getQueueTicketList(result.Data["CALENDAR_CODE"]?.ToString(), result.Data["COMPANY_CODE"]?.ToString(), null, true);
                }
                else
                {
                    Clients.Client(Context.ConnectionId).showMarketplaceErrorResult(result);
                }

            }
            catch (Exception ex)
            {
                Clients.Client(Context.ConnectionId).showMarketplaceErrorResult(new AddUpdateDelete() { Status = false, Message = "Unable to upadate status" });
            }

            await Task.CompletedTask;
        }

        #endregion

    }
}