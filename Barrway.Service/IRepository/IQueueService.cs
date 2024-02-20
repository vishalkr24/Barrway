using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.IRepository
{
    public interface IQueueService
    {
        Task<AddUpdateDelete> getSessionList(string CalendarCode, string CompanyCode);
        Task<AddUpdateDelete> getCurrentSession(string CalendarCode, string CompanyCode);
        Task<AddUpdateDelete> getQueueList(string CalendarCode, string CompanyCode);
        Task<AddUpdateDelete> updateQueueActivationStatus(string QueueId, string Status);

        #region marketplace queue
        Task<AddUpdateDelete> bookTicket(TicketMasterModel model);
        Task<AddUpdateDelete> updateQueueTicketStatus(TicketMasterModel model);
        Task<AddUpdateDelete> getMarketplaceQueueList(string CalendarCode, string CompanyCode);
        #endregion
    }
}
