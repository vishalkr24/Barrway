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

        public async Task<IDictionary<string,object>> GetCalendarMaster(string code) {

            string sqlString = $@"select *from BUSINESS_CALENDAR_MASTER_1925 where CALENDAR_CODE='{code}'";
            var result = await sqlFunction.ExecuteSqlQuery(sqlString);
            return result.FirstOrDefault();
        }

        public async Task<List<IDictionary<string, object>>> GetEvents(Form_DataTable data) {

            string filterQuery = data.filter.value;
            string sqlString = $@"DECLARE @retval nvarchar(max);       DECLARE @sQuery nvarchar(max); DECLARE @ParmDefinition nvarchar(max);          
								  DECLARE @customTitleQuery nvarchar(max);                                                            
								  IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END   ;with cte1 as( select distinct  f.*,f.resources 'resourceId'  ,  
								  --STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]                                    
								  --from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle                                  , 
								  (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,   (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2                                       
								  where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) customForms  , (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) from form_calenderreferrence f2                                      
								  where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) customFormIds,  '' referrences_1,  '' referrences_2,  '' referrences_3                                                                       
								  from CALENDAR_FORM_1935 f                                      join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE                                  
								  where                                  f.formid=2305 and                                   
								 {filterQuery} 
                                ),                                  
								  cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1  where len(customtitle)>0)                                  
								  select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= 1;                                   
								  select @counter = (select count(1) from #temptable) while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c; SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'      
								  SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';                                  
								  EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT;    
								  update #temptable set customTitle=@retval where ROWNUMBER=@c; set @c = @c + 1;  end  select * from #temptable";

            var result = await sqlFunction.ExecuteSqlQuery(sqlString);
            return result;
        }
    }
}
