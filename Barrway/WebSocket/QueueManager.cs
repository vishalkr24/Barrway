using Barrway.Service.IRepository;
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
        private readonly IMasterService masterService;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly ISqlFunction sqlFunction;
        private readonly IBusinessUserService businessUserService;
        private readonly IAuthService authService;

        // GET: Calendar
        public QueueManager(IMasterService masterService, IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction, IBusinessUserService businessUserService, IAuthService authService)
        {
            this.masterService = masterService;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
            this.businessUserService = businessUserService;
            this.authService = authService;
        }

        public void Send(string name, string message)
        {
            Clients.All.addNewMessageToPage(name, message);
        }



    }
}