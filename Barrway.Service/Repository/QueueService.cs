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

        public async Task<AddUpdateDelete> getSessionList(string CalendarCode, string CompanyCode)
        {
            try
            {
                string query = $@"select session_m.* from QUEUE_SESSION_MASTER_1974 session_m
                                    join QUEUE_MASTER_1973 queue_m on queue_m.Id = session_m.QUEUE_ID
                                    where cast(session_m.created_at as date) = cast(getDate() as date) and (queue_m.CALENDAR_CODE = '{CalendarCode}' and queue_m.COMPANY_CODE = '{CompanyCode}')";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> UpdateCalendarReference(FormCalenderReferrenceTable data)
        {
            string sqlString = $@"update TRANSACTION_MASTER_1942 set CALENDAR_CODE='{data.CALENDAR_CODE}',COMPANY_CODE='{data.COMPANY_CODE}' where formGroupKey='{data.formGroupKey}'";
            var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
            if (result > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
            }
            return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
        }

    }
}
