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
                string query = $@"select * from QUEUE_SESSION_MASTER_1974 where CALENDAR_CODE = '{CalendarCode}' and COMPANY_CODE = '{CompanyCode}'";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> getQueueList(string CalendarCode, string CompanyCode)
        {
            try
            {
                string query = $@"select * from QUEUE_MASTER_1973 where CALENDAR_CODE = '{CalendarCode}' and COMPANY_CODE = '{CompanyCode}'";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> updateQueueActivationStatus(string QueueId, string Status)
        {
            string sqlString = $@"update QUEUE_MASTER_1973 set ACCEPT_TICKET = '{Status??"N"}' where Id='{QueueId}'";
            var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
            if (result > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
            }
            return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
        }

    }
}
