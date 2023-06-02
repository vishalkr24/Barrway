using Dapper;
using Barrway.Service.IRepository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Barrway.DTO.Common;
using Barrway.DTO.BusinessModels;
using FormGeneratorDTOs.DTOs;
using Barrway.Utility.Common;
using Barrway.DTO.PublicModels;
using Barrway.DTO.UserAdminModels;

namespace Barrway.Service.Repository
{
    public class PublicUserService : IPublicUserService
    {
        private readonly string connectionString;
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly IAuthService authService;

        public PublicUserService(IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction, IAuthService authService)
        {
            this.connectionString = ConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
            this.authService = authService;
        }

        public async Task<AddUpdateDelete> CreatePublicUserAccount(PublicAccountModel model)
        {
            Form_DataTable data = new Form_DataTable();
            data.action = (int)FormAction.Save;
            data.formId = (int)FormSetting.PUBLIC_USER_ACCOUNT;

            data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
            data.formGroupKey = Guid.NewGuid().ToString();
            var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (formResult.res == 1)
            {
                return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = formResult.Id.ToString() };
            }
            else
            {
                return new AddUpdateDelete() { Message = formResult.Message, Status = false };
            }
        }

        public async Task<AddUpdateDelete> GetSinglePublicUserAccount(string UserId)
        {
            string query = $@"SELECT publicUser.[Id]
                              ,publicUser.[USER_ID]
                              ,publicUser.[USER_PASSWORD]
                              ,publicUser.[USER_EMAIL]
                              ,publicUser.[USER_PHONE]
                              ,publicUser.[IS_EXTERNAL_SIGNUP]
                              ,publicUser.[IS_EMAIL_VERIFIED]
                              ,publicUser.[IS_PHONE_VERIFIED]
                              ,publicUser.[created_at]
                              ,publicUser.[updated_at]
                              ,publicUser.[created_by]
                              ,publicUser.[updated_by]
                              ,publicUser.[IS_ACTIVE]
                              ,publicUser.[PROFILE_STATUS]
                              ,publicUser.[ROLE_ID]
                              ,publicUser.[SIGNUP_TYPE], publicUser.[Id]      ,publicUser.[created_at]      ,publicUser.[updated_at]      ,publicUser.[created_by]      ,publicUser.[updated_by]      ,publicUser.[USER_ID]      ,[SUBSCRIPTION_PLAN_ID]      ,[CURRENT_STEP]     ,[FIRST_NAME]      ,[LAST_NAME]      ,[PROFILE_PHOTO_PATH]      ,[PROFILE_PHOTO_NAME]      ,[CHINESE_NAME]      ,[NICK_NAME]      ,[GENDER]      ,[DATE_OF_BIRTH]  
                        FROM[dbo].[PUBLIC_USER_ACCOUNT_1943] account 
                        join USER_MASTER_1915 publicUser on publicUser.USER_ID = account.USER_ID
                        where publicUser.USER_ID = '" + UserId + "'";

            List<IDictionary<string, object>> businessWebsiteResult = await sqlFunction.ExecuteSqlQuery(query);

            if (businessWebsiteResult.Count > 0)
            {
                var businessWebsite = businessWebsiteResult.FirstOrDefault();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = businessWebsite };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> UpdatePublicUserProfilePic(PublicAccountModel model)
        {
            string query = $@"update PUBLIC_USER_ACCOUNT_1943 set PROFILE_PHOTO_NAME = '{model.PROFILE_PHOTO_NAME}', PROFILE_PHOTO_PATH = '{model.PROFILE_PHOTO_PATH}' where USER_ID = '{model.USER_ID}'";

            int result = await sqlFunction.ExecuteSqlCommandQuery(query);

            if (result > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> UpdatePublicUserProfileData(PublicUserProfileModel model, bool updatePassword = false)
        {
            string subQuery = "";
            if (updatePassword)
            {
                subQuery = "USER_PASSWORD = '" + model.USER_PASSWORD + "'";
            }

            string query = $@"update PUBLIC_USER_ACCOUNT_1943 set FIRST_NAME = '{model.FIRST_NAME}', LAST_NAME = '{model.LAST_NAME}', CHINESE_NAME = N'{model.CHINESE_NAME}', NICK_NAME = '{model.NICK_NAME}', GENDER = '{model.GENDER}', DATE_OF_BIRTH = '{model.DATE_OF_BIRTH.ToString("yyyy-MM-ddTHH:mm:ss")}' where USER_ID = '{model.USER_ID}'
                              update USER_MASTER_1915 set {subQuery}  USER_PHONE = '{model.USER_PHONE}' where USER_ID = '{model.USER_ID}' and ROLE_ID = 2
                    
                            ";

            int result = await sqlFunction.ExecuteSqlCommandQuery(query);

            if (result > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> EnrollPublicUserForCalendar(CalendarEnrollModel model)
        {
            var user = await authService.GetUser(model.USER_ID, FormRole.PUBLIC_USER);

            // Check if the user already exist in the participant master
            
            List<IDictionary<string, object>> participantCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from PARTICIPANT_MASTER_1940 where EMAIL = '{user.Data["USER_EMAIL"]}' and COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE}'");

            string StudentId = "";
            if (participantCheckResult.Count > 0)
            {
                // Participant already exist so no need to check if it is enrolled with the selected activity and resource
                
                List<IDictionary<string, object>> transactionCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from TRANSACTION_MASTER_1942 where COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE}' and RESOURCE = '{model.transaction.RESOURCE}' and ACTIVITY = '{model.transaction.ACTIVITY}'");

                if (transactionCheckResult.Count > 0)
                {
                    // user is already enrolled in the activity and resource
                    return new AddUpdateDelete() { Message = "ALREADY-ENROLLED", Status = false };
                }
                else
                {
                    // User is not enrolled for the selected activity and resource
                    StudentId = participantCheckResult.FirstOrDefault()["Id"].ToString();
                }

            }
            else
            {
                // add entry in participant master table
                var publicUser = await GetSinglePublicUserAccount(model.USER_ID);

                model.participant.NICKNAME = publicUser.Data["NICK_NAME"].ToString();
                model.participant.EMAIL = user.Data["USER_EMAIL"].ToString();
                model.participant.DATE_OF_BIRTH = Convert.ToDateTime(publicUser.Data["DATE_OF_BIRTH"]);
                model.participant.ADDRESS = "";
                model.participant.GENDER = publicUser.Data["GENDER"].ToString();
                model.participant.IS_ACTIVE = "Y";
                model.participant.STUDENT_NAME = publicUser.Data["FIRST_NAME"].ToString() + " " + publicUser.Data["LAST_NAME"].ToString();
                
                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.PARTICIPANT_MASTER;

                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.participant.ToDictionary());
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                if (formResult.res == 1)
                {
                    StudentId = formResult.Id.ToString();

                    string ParticipantCode = "PC" + formResult.Id.ToString().PadLeft(5, '0');

                    string query = $@"UPDATE [dbo].[PARTICIPANT_MASTER_1940]
                                   SET [PARTICIPANT_CODE] = '{ParticipantCode}'
                                 WHERE Id = '{formResult.Id.ToString()}'";

                    int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                }
                else
                {
                    return new AddUpdateDelete() { Message = "Failed to add participant", Status = false };
                }

            }

            // send Entry into transaction master
            model.transaction.STUDENT = StudentId;
            Form_DataTable data2 = new Form_DataTable();
            data2.action = (int)FormAction.Save;
            data2.formId = (int)FormSetting.TRANSACTION_MASTER;

            data2.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.transaction.ToDictionary());
            data2.formGroupKey = Guid.NewGuid().ToString();
            var formResult2 = (await formAPIRepository.GeneratedFormData(data2)).Data;

            // send Entry into Upcoming Bookings
            
            string upcomingBookingQuery = $@"INSERT INTO [dbo].[COMPANY_UPCOMING_BOOKINGS_1945]
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
                                                   ,[created_at]
                                                   ,[updated_at]
                                                   ,[created_by]
                                                   ,[updated_by]
                                                   ,[COMPANY_CODE]
                                                   ,[CALENDAR_CODE]
                                                   ,[BOOKING_DATE]
                                                   ,[SERVICE_NAME]
                                                   ,[SERVICE_PROVIDER]
                                                   ,[CLIENT_NAME]
                                                   ,[FROM_TIME]
                                                   ,[TO_TIME])
                                             VALUES
                                                   ('{Guid.NewGuid().ToString()}'
                                                   ,2315
                                                   ,30314
                                                   ,0
                                                   ,0
                                                   ,0
                                                   ,0
                                                   ,0
                                                   ,(select ISNULL(Max(formRecordOrder), 0) from COMPANY_UPCOMING_BOOKINGS_1945)
                                                   ,0
                                                   ,getdate()
                                                   ,getdate()
                                                   ,null
                                                   ,null
                                                   ,'{model.transaction.COMPANY_CODE}'
                                                   ,'{model.transaction.CALENDAR_CODE}'
                                                   ,(select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = '{model.transaction.SLOT}')                                                                                                                                                                                                     
                                                   ,'{model.ACTIVITY_NAME}'
                                                   ,'{model.RESOURCE_NAME}'
                                                   ,'{model.participant.STUDENT_NAME}'
                                                   ,(select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = '{model.transaction.SLOT}') 
                                                   ,(select calendar.[end] from  CALENDAR_FORM_1935 calendar where Id = '{model.transaction.SLOT}') )";


            var upcomingResult = await sqlFunction.ExecuteSqlCommandQuery(upcomingBookingQuery);

            if (formResult2.res == 1)
            {
                return new AddUpdateDelete() { Message = "Success", Status = true };
            }
            else
            {
                return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
            }

        }

        public async Task<AddUpdateDelete> GetAllEnrolledCompaniesData(string userEmail)
        {
            try
            {

                string query = $@"SELECT distinct calendar.[COMPANY_CODE], calendar.[CALENDAR_CODE], company.COMPANY_NAME_ENGLISH, calendar.[start] as 'Date'
                                  FROM [dbo].[CALENDAR_FORM_1935] calendar
                                  join TRANSACTION_MASTER_1942 transaction_m on calendar.CALENDAR_CODE = transaction_m.CALENDAR_CODE
                                  join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
                                  where EMAIL = '{userEmail}' and calendar.Id = transaction_m.SLOT";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
            }
        }

        public async Task<AddUpdateDelete> GetRecentlyBookedCalendars(string userEmail)
        {
            try
            {
                string query = $@"SELECT distinct calendar.[COMPANY_CODE]
                                      ,calendar.[CALENDAR_CODE]
	                                  ,calendar.[Id]
                                      ,calendar.[created_at]
                                      ,company.Id as 'CompanyId'
                                      ,calendarDetails.*
	                                  ,company.COMPANY_NAME_ENGLISH
                                      ,company.COMPANY_LOGO_PATH
                                      ,service_m.ACTIVITY_NAME
                                      ,subCategory.CALENDAR_SUB_CATEGORY_NAME
                                  FROM [dbo].[CALENDAR_FORM_1935] calendar
                                  join TRANSACTION_MASTER_1942 transaction_m on calendar.CALENDAR_CODE = transaction_m.CALENDAR_CODE
                                  join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
								  join SERVICE_MASTER_1933 service_m on service_m.Id = transaction_m.ACTIVITY
                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
								  join BUSINESS_CALENDAR_MASTER_1925 calendarDetails on calendarDetails.CALENDAR_CODE = calendar.CALENDAR_CODE
								  join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendarDetails.CALENDAR_SUB_CATEGORY_ID
                                  where EMAIL = '{userEmail}' and calendar.Id = transaction_m.SLOT
								  order by calendar.created_at desc
								  offset 0 rows fetch first 5 rows only";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
            }
        }

        public async Task<AddUpdateDelete> GetAllEnrolledCalendarsData(string CompanyCode, string UserEmail, string filterDate = null)
        {
            try
            {
                string CompanyCondition = "";

                if (!string.IsNullOrEmpty(CompanyCode) && CompanyCode != "0")
                {
                    CompanyCondition = " calendar.COMPANY_CODE='" + CompanyCode + "' and ";
                }

                if (!string.IsNullOrEmpty(filterDate))
                {
                    CompanyCondition += "CAST(calendar.[start] AS DATE) = CAST('" + filterDate + "' AS DATE) and ";
                }

                string query = $@"SELECT distinct calendar.[COMPANY_CODE]
                                      ,calendar.[CALENDAR_CODE]
	                                  ,calendar.[Id]
                                      ,[title]
                                      ,[start]
                                      ,[end]
                                      ,[allDay]
                                      ,[resources]
                                      ,[activities]
                                      ,calendar.[description]
                                      ,calendar.[color]
                                      ,calendar.[created_at]
                                      ,calendar.[updated_at]
                                      ,calendar.[created_by]
                                      ,calendar.[updated_by]
                                      ,[tabulator_1683726769059]
                                      ,[tabulator_1683785383381]
                                      ,[SCHEDULAR_FORM_ID]
                                      ,[CREATION_TYPE]
                                      ,[SLOT_DURATION_IN_MINS]
                                      ,[EVENT_TYPE]
	                                  ,transaction_m.*
	                                  ,participant.*
	                                  ,company.COMPANY_NAME_ENGLISH
                                      ,company.COMPANY_LOGO_PATH
                                      ,service_m.ACTIVITY_NAME
                                      ,service_p_m.FIRST_NAME
                                  FROM [dbo].[CALENDAR_FORM_1935] calendar
                                  join TRANSACTION_MASTER_1942 transaction_m on calendar.CALENDAR_CODE = transaction_m.CALENDAR_CODE
                                  join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
                                  join SERVICE_MASTER_1933 service_m on service_m.Id = calendar.activities
                                  join SERVICE_PROVIDER_MASTER_1934 service_p_m on service_p_m.Id = calendar.resources
                                  where {CompanyCondition} participant.EMAIL = '{UserEmail}' and calendar.Id = transaction_m.SLOT";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
            }
        }
        public async Task<AddUpdateDelete> GetFullCalendarEvents(string StartDate, string EndDate, string UserEmail)
        {
            try
            {
                string query = $@"DECLARE @retval nvarchar(max);       DECLARE @sQuery nvarchar(max); DECLARE @ParmDefinition nvarchar(max);                        
                                    DECLARE @customTitleQuery nvarchar(max);           

                                    IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END 
                                    ;with cte1 as( select distinct  f.*,f.resources 'resourceId', company.COMPANY_LOGO_PATH, company.COMPANY_NAME_ENGLISH ,  STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                                    from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle
                                    , (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,   (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                                    where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) customForms  , (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) 
                                    from form_calenderreferrence f2    where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) customFormIds,  '' referrences_1,  '' referrences_2,  '' referrences_3   
                                    from CALENDAR_FORM_1935 f 
                                    join TRANSACTION_MASTER_1942 transaction_m on transaction_m.CALENDAR_CODE = f.CALENDAR_CODE
                                    join PARTICIPANT_MASTER_1940 participant_m on participant_m.Id = transaction_m.STUDENT
                                    join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                    where  (CAST([start] as date) >= CAST('{StartDate}' as date) and  CAST([start] as date) <=CAST('{EndDate}' as date) )    and f.formid=2305   and participant_m.EMAIL = '{UserEmail}' and transaction_m.SLOT = f.Id
                                    ) ,
                                    cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1	 where len(customtitle)>0) 


                                    select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= 1;   
                                    select @counter = (select count(1) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                                    SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';   
                                    EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT;    update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end  select* from #temptable";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                result.Add(new Dictionary<string, object>());

                if (result.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
            }
        }
    }
}
