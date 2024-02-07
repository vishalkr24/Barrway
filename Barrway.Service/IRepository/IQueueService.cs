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
        Task<AddUpdateDelete> UpdateCalendarReference(FormCalenderReferrenceTable data);
    }
}
