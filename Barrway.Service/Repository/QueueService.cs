using Barrway.DTO.Common;
using Barrway.Service.IRepository;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.Repository
{
    public class QueueService : IQueueService
    {
        private readonly ISqlFunction sqlFunction;

        public QueueService(ISqlFunction sqlFunction)
        {
            this.sqlFunction = sqlFunction;
        }

        public async Task<AddUpdateDelete> UpdateCalendarReference(FormCalenderReferrenceTable data)
        {
            string sqlString = $@"update TRANSACTION_MASTER_1942 set CALENDAR_CODE='{data.CALENDAR_CODE}',COMPANY_CODE='{data.COMPANY_CODE}' where formGroupKey='{data.formGroupKey}'";
            var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
            if (result > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
            }
            return new AddUpdateDelete() { Status=false,Message=AppMessage.NotFound};
        }

    }
}
