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
        Task<AddUpdateDelete> getQueueList(string CalendarCode, string CompanyCode);
        Task<AddUpdateDelete> updateQueueActivationStatus(string QueueId, string Status);
    }
}
