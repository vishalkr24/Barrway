using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using Barrway.Service.IRepository;
using Barrway.Utility.Common;
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
        private readonly IFormAPIRepository formAPIRepository;
        public QueueService(ISqlFunction sqlFunction, IFormAPIRepository formAPIRepository)
        {
            this.sqlFunction = sqlFunction;
            this.formAPIRepository = formAPIRepository;
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

        public async Task<AddUpdateDelete> getCurrentSession(string CalendarCode, string CompanyCode, bool ByDate = false)
        {
            try
            {
                string query = $@"select * from QUEUE_SESSION_MASTER_1974 ses
                                    where ses.CALENDAR_CODE = '{CalendarCode}' and ses.COMPANY_CODE = '{CompanyCode}' and  {getCommonDateConditionString(ByDate)}";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> getQueueList(string CalendarCode, string CompanyCode, bool ByDate = false)
        {
            try
            {
                string query = $@"
                                declare @CompanyCode varchar(100) = '{CompanyCode}';
                                declare @CalendarCode varchar(100) = '{CalendarCode}';
                                declare @QueueIds varchar(max) = stuff((select ',' + cast(que.Id as varchar(10)) from QUEUE_MASTER_1973 que
									left join QUEUE_SESSION_MAPPING_1976 map on map.QUEUE_ID = que.Id
									where ((map.CALENDAR_CODE = @CalendarCode and map.COMPANY_CODE = @CompanyCode) or (map.CALENDAR_CODE is null or map.COMPANY_CODE is null)) and map.Id is null for xml path('')), 1, 1, '')
									
                                select 'Y' as 'QUEUE_SETUP_COMPLETED', q_m.* from QUEUE_SESSION_MASTER_1974 ses
                                                                    join QUEUE_SESSION_MAPPING_1976 map on map.SESSION_ID = ses.Id
                                                                    join QUEUE_MASTER_1973 q_m on q_m.Id = map.QUEUE_ID
                                                                    where ses.CALENDAR_CODE = @CalendarCode and ses.COMPANY_CODE = @CompanyCode {getCommonDateConditionString(ByDate)}
                                Union All
                                select  'N' as 'QUEUE_SETUP_COMPLETED', * from QUEUE_MASTER_1973
								where QUEUE_TYPE = 'COUNTER' and CALENDAR_CODE = @CalendarCode and COMPANY_CODE = @CompanyCode
								and Id in (select cast(item as integer) from dbo.SplitString(@QueueIds, ','))";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> getSingleQueueDetails(string QueueId)
        {
            try
            {
                string query = $@"select * from QUEUE_MASTER_1973 where Id = '{QueueId}'";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        private string getCommonDateConditionString(bool ByDate = false)
        {
            return $@" and 
                                    (
	                                    Convert({((ByDate) ? "datetime" : "time")}, '{DateTimeUtility.Now().ToString("dd-MM-yyyy HH:mm:ss")}', 105) > Convert({((ByDate) ? "datetime" : "time")}, ses.SESSION_START_TIME, 105) and 
	                                    Convert({((ByDate) ? "datetime" : "time")}, '{DateTimeUtility.Now().ToString("dd-MM-yyyy HH:mm:ss")}', 105) < Convert({((ByDate) ? "datetime" : "time")}, ses.SESSION_END_TIME, 105)
                                    )";
        }

        public async Task<AddUpdateDelete> getQueueTicketList(string CalendarCode, string CompanyCode, string QueueIds = null, bool ByDate = false)
        {
            try
            {
                string IdString = "";

                if (string.IsNullOrEmpty(QueueIds))
                {
                    IdString = $@" stuff((select ',' + cast(q_m.Id as varchar) from QUEUE_SESSION_MASTER_1974 ses
                                    join QUEUE_SESSION_MAPPING_1976 map on map.SESSION_ID = ses.Id
                                    join QUEUE_MASTER_1973 q_m on q_m.Id = map.QUEUE_ID
                                    where ses.CALENDAR_CODE = '{CalendarCode}' and ses.COMPANY_CODE = '{CompanyCode}'  {getCommonDateConditionString(ByDate)} for xml path('')), 1, 1, '');";
                }
                else
                {
                    IdString = "'" + QueueIds + "'";
                }

                string query = $@"declare @QueueIds varchar(max) = {IdString}

                                select * from TICKET_MASTER_1975 ticket
                                where (ticket.QUEUE_ID in (select cast(item as integer) from dbo.SplitString(@QueueIds,','))) 
                                and SESSION_ID = (
	                                select top 1 ses.Id from QUEUE_SESSION_MASTER_1974 ses
                                    join QUEUE_SESSION_MAPPING_1976 map on map.SESSION_ID = ses.Id
                                    join QUEUE_MASTER_1973 q_m on q_m.Id = map.QUEUE_ID
                                    where q_m.Id = ticket.QUEUE_ID  {getCommonDateConditionString(ByDate)}
                                ) order by ticket.POSITION";

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
            string sqlString = $@"update QUEUE_MASTER_1973 set ACCEPT_TICKET = '{Status ?? "N"}' where Id='{QueueId}'";
            var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
            if (result > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
            }
            return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
        }

        public async Task<AddUpdateDelete> callNext(string QueueId, bool ByDate = false)
        {
            try
            {
                string query = $@"declare @QueueIds varchar(max) =  '{QueueId}';

                                update TICKET_MASTER_1975 set STATUS = 'SERVED', POSITION = 0
                                where (QUEUE_ID in (select cast(item as integer) from dbo.SplitString(@QueueIds,','))) 
                                and SESSION_ID = (
	                                select top 1 ses.Id from QUEUE_SESSION_MASTER_1974 ses
                                    join QUEUE_SESSION_MAPPING_1976 map on map.SESSION_ID = ses.Id
                                    join QUEUE_MASTER_1973 q_m on q_m.Id = map.QUEUE_ID
                                    where q_m.Id = TICKET_MASTER_1975.QUEUE_ID  {getCommonDateConditionString(ByDate)}
                                ) and STATUS = 'IN PROGRESS';";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                await updateQueueTicketPosition(new TicketMasterModel() { QUEUE_ID = QueueId });

                query = $@"declare @QueueIds varchar(max) =  '{QueueId}';

								update TICKET_MASTER_1975 set STATUS = 'IN PROGRESS' where Id = (
                                select top 1 Id from TICKET_MASTER_1975
                                where (QUEUE_ID in (select cast(item as integer) from dbo.SplitString(@QueueIds,','))) 
                                and SESSION_ID = (
	                                select top 1 ses.Id from QUEUE_SESSION_MASTER_1974 ses
                                    join QUEUE_SESSION_MAPPING_1976 map on map.SESSION_ID = ses.Id
                                    join QUEUE_MASTER_1973 q_m on q_m.Id = map.QUEUE_ID
                                    where q_m.Id = TICKET_MASTER_1975.QUEUE_ID  {getCommonDateConditionString(ByDate)}
                                ) and STATUS = 'WAITING' ORDER BY TICKET_MASTER_1975.POSITION);";

                var result2 = await sqlFunction.ExecuteSqlQuery(query);


                query = $@"select * from QUEUE_MASTER_1973 where Id = '{QueueId}'";

                var result3 = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result3.FirstOrDefault() };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }



        public async Task<AddUpdateDelete> bookTicket(TicketMasterModel model, bool ByDate = false)
        {
            try
            {
                string query = $@"select top 1 cast(ses.Id as varchar) as 'Id' from QUEUE_SESSION_MASTER_1974 ses
                                    join QUEUE_SESSION_MAPPING_1976 map on map.SESSION_ID = ses.Id
                                    join QUEUE_MASTER_1973 q_m on q_m.Id = map.QUEUE_ID
                                    join BUSINESS_CALENDAR_MASTER_1925 cal on cal.CALENDAR_CODE = ses.CALENDAR_CODE
                                    where map.QUEUE_ID = '{model.QUEUE_ID}'  {getCommonDateConditionString(ByDate)} and 
                                    (
	                                    Convert(datetime, '{DateTimeUtility.Now().ToString("dd-MM-yyyy HH:mm:ss")}', 105) > Convert(datetime, ses.QUEUE_OPEN_TIME, 105)
                                    ) order by cast(ses.QUEUE_OPEN_TIME as time) desc";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count == 0)
                {
                    return new AddUpdateDelete() { Status = false, Message = "Session expired!" };
                }
                else
                {
                    model.SESSION_ID = result.FirstOrDefault()["Id"]?.ToString();
                }

                query = $@"select * from TICKET_MASTER_1975 where SESSION_ID = '{model.SESSION_ID}' and QUEUE_ID = '{model.QUEUE_ID}' and USER_ID = N'{model.USER_ID}' and STATUS not in ('DELETED', 'SERVED')";

                var result2 = await sqlFunction.ExecuteSqlQuery(query);

                if (result2.Count > 0 && model.IsApproved == "N")
                {
                    return new AddUpdateDelete() { Status = false, Message = ("You have already booked this ticket: " + (result2.FirstOrDefault()["TICKET_NUMBER"]?.ToString() ?? "(ticket not found)") + ".\n\nThis ticket will be removed and new ticket will be assigned.\n\nAre you sure to continue? "), Data = model };
                }

                query = $@"delete from TICKET_MASTER_1975 where SESSION_ID = '{model.SESSION_ID}' and QUEUE_ID = '{model.QUEUE_ID}' and USER_ID = N'{model.USER_ID}' and STATUS not in ('DELETED', 'SERVED')";

                var result3 = await sqlFunction.ExecuteSqlCommandQuery(query);

                query = $@"select * from QUEUE_MASTER_1973 where Id = '{model.QUEUE_ID}'";

                var result4 = await sqlFunction.ExecuteSqlQuery(query);

                query = $@"INSERT INTO [dbo].[TICKET_MASTER_1975]
                                   ([formGroupKey]
                                   ,[formID]
                                   ,[userID]
                                   ,[Current_Status]
                                   ,[cycle]
                                   ,[MasterFormID]
                                   ,[MasterFormRow]
                                   ,[formRecordOrder]
                                   ,[formRecordStatus]
                                   ,[ApprovalStatus]
                                   ,[TICKET_NUMBER]
                                   ,[SESSION_ID]
                                   ,[QUEUE_ID]
                                   ,[USER_ID]
                                   ,[STATUS]
                                   ,[created_at]
                                   ,[updated_at]
                                   ,[created_by]
                                   ,[updated_by]
                                   ,[POSITION])
                            output inserted.Id as 'Id'
                             VALUES
                                   ('{Guid.NewGuid().ToString()}'
                                   ,2347
                                   ,0
                                   ,0
                                   ,0
                                   ,0
                                   ,null
                                   ,0
                                   ,0
                                   ,null
                                   ,(select dbo.GenerateQueueTicketNumber('{model.QUEUE_ID}','{DateTimeUtility.Now().ToString("dd-MM-yyyy HH:mm")}','{model.SESSION_ID}'))
                                   ,'{model.SESSION_ID}'
                                   ,'{model.QUEUE_ID}'
                                   ,'{model.USER_ID}'
                                   ,'{model.STATUS}'
                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                   ,null
                                   ,null
                                   ,0)";


                var formResult = await sqlFunction.ExecuteSqlQuery(query);

                await updateQueueTicketPosition(model);

                query = $@"UPDATE TICKET_MASTER_1975 set FULL_TICKET_NUMBER = (select QUEUE_PREFIX from QUEUE_MASTER_1973 qp where qp.Id = '{model.QUEUE_ID}') + TICKET_NUMBER where Id = '{formResult.FirstOrDefault()["Id"]?.ToString()}'";

                var result5 = await sqlFunction.ExecuteSqlQuery(query);

                if (formResult.Count > 0)
                {
                    string finalQuery = $@"select * from TICKET_MASTER_1975 where Id = '{formResult.FirstOrDefault()["Id"]?.ToString()}'";
                    var finalResult = await sqlFunction.ExecuteSqlQuery(finalQuery);

                    return new AddUpdateDelete() { Data = result4.FirstOrDefault(), Message = $"Ticket booked successfully!\n\nTicket#: {finalResult.FirstOrDefault()["FULL_TICKET_NUMBER"]?.ToString()}", Status = true };
                }
                else
                {
                    return new AddUpdateDelete() { Message = "Unable to book ticket", Status = false };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = "Unable to book ticket." };
            }
        }

        public async Task<AddUpdateDelete> updateQueueTicketPosition(TicketMasterModel model, bool ByDate = false)
        {
            try
            {
                string query = $@"
                                  declare @sessionId varchar(10);
                                  set @sessionId = (select top 1 cast(ses.Id as varchar) from QUEUE_SESSION_MASTER_1974 ses
                                    join QUEUE_SESSION_MAPPING_1976 map on map.SESSION_ID = ses.Id
                                    join QUEUE_MASTER_1973 q_m on q_m.Id = map.QUEUE_ID
                                    join BUSINESS_CALENDAR_MASTER_1925 cal on cal.CALENDAR_CODE = ses.CALENDAR_CODE
                                    where map.QUEUE_ID = '{model.QUEUE_ID}'  {getCommonDateConditionString(ByDate)} and 
                                    (
	                                    Convert(datetime, '{DateTimeUtility.Now().ToString("dd-MM-yyyy HH:mm:ss")}', 105) > Convert(datetime, ses.QUEUE_OPEN_TIME, 105)
                                    ) order by cast(ses.QUEUE_OPEN_TIME as time) desc)
                                DECLARE @Counter INT = 0;
                                DECLARE @QueuePrefix varchar = (select QUEUE_PREFIX from QUEUE_MASTER_1973 where Id = '{model.QUEUE_ID}');
                                
                                UPDATE TICKET_MASTER_1975
                                SET POSITION = @Counter , @Counter = @Counter + 1
                                where 
                                SESSION_ID = @sessionId and QUEUE_ID = '{model.QUEUE_ID}' and ([STATUS] = 'WAITING' or [STATUS] = 'IN PROGRESS')";

                var result = await sqlFunction.ExecuteSqlCommandQuery(query);
                if (result > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "No Status Updated" };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> getMarketplaceQueueList(string CalendarCode, string CompanyCode, bool ByDate = false)
        {
            try
            {
                string query = $@"select q_m.* from QUEUE_SESSION_MASTER_1974 ses
                                    join QUEUE_SESSION_MAPPING_1976 map on map.SESSION_ID = ses.Id
                                    join QUEUE_MASTER_1973 q_m on q_m.Id = map.QUEUE_ID
                                    join BUSINESS_CALENDAR_MASTER_1925 cal on cal.CALENDAR_CODE = ses.CALENDAR_CODE
                                    where ses.CALENDAR_CODE = '{CalendarCode}' and ses.COMPANY_CODE = '{CompanyCode}' q_m.QUEUE_USAGE = 'TICKET' and {getCommonDateConditionString(ByDate)} and 
                                    (
	                                    Convert(datetime, '{DateTimeUtility.Now().ToString("dd-MM-yyyy HH:mm:ss")}', 105) > Convert(datetime, ses.QUEUE_OPEN_TIME, 105)
                                    ) order by cast(ses.QUEUE_OPEN_TIME as time) desc";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

    }
}
