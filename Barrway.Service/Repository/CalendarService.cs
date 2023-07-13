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
    public class CalendarService: ICalendarService
    {
        private readonly ISqlFunction sqlFunction;

        public CalendarService(ISqlFunction sqlFunction)
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

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetPublicUserTransactionEvent(string eventIds) {

            string sqlString = $@"select p.*,clr.Id EventId from TRANSACTION_MASTER_1942  st_trans
                                    join CALENDAR_FORM_1935 clr on st_trans.SLOT=clr.Id
                                    join PARTICIPANT_MASTER_1940 p on st_trans.STUDENT=p.Id
                                    where clr.Id in ({eventIds});";

            var data = await sqlFunction.ExecuteSqlQuery(sqlString);
            return new AddUpdateDelete<List<IDictionary<string, object>>>() { Status = true, Data = data };
        }
    }
}
