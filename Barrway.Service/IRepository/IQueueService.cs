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
        Task<AddUpdateDelete> getCurrentSession(string CalendarCode, string CompanyCode, bool ByDate = false);
        Task<AddUpdateDelete> getQueueList(string CalendarCode, string CompanyCode, bool ByDate = false);
        Task<AddUpdateDelete> getQueueTicketList(string CalendarCode, string CompanyCode, string QueueIds = null, bool ByDate = false);
        Task<AddUpdateDelete> updateQueueActivationStatus(string QueueId, string Status);
        Task<AddUpdateDelete> callNext(string QueueId, bool ByDate = false);
        Task<AddUpdateDelete> getSingleQueueDetails(string QueueId);

        #region marketplace queue
        Task<AddUpdateDelete> bookTicket(TicketMasterModel model, bool ByDate = false);
        Task<AddUpdateDelete> updateQueueTicketPosition(TicketMasterModel model, bool ByDate = false);
        Task<AddUpdateDelete> getMarketplaceQueueList(string CalendarCode, string CompanyCode, bool ByDate = false);
        #endregion
    }
}
