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
using Barrway.DTO.MarketplaceModels;
using System.Reflection;
using System.Diagnostics;
using Newtonsoft.Json;
using System.IO;
using System.Web;

namespace Barrway.Service.Repository
{
    public class PublicUserService : IPublicUserService
    {
        private readonly string connectionString;
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly IAuthService authService;
        private readonly IMasterService masterService;
        private readonly IBusinessUserService businessUserService;

        public PublicUserService(IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction, IAuthService authService, IMasterService masterService, IBusinessUserService businessUserService)
        {
            this.connectionString = ConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
            this.authService = authService;
            this.masterService = masterService;
            this.businessUserService = businessUserService;
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

        public async Task<AddUpdateDelete> GetSingleEventDetails(string EventId)
        {
            string query = $@"DECLARE @retval nvarchar(max);       DECLARE @sQuery nvarchar(max); DECLARE @ParmDefinition nvarchar(max);                        
                            DECLARE @customTitleQuery nvarchar(max);                          
                            IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END   ;with cte1 as( select distinct  f.*,f.resources 'resourceId'  ,  STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                            from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle
                            , (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,   (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                            where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) customForms  , (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) from form_calenderreferrence f2    
                            where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) customFormIds,  '' referrences_1,  '' referrences_2,  '' referrences_3 , service_m.fees_1
                            from CALENDAR_FORM_1935 f   
                            join SERVICE_MASTER_1933 service_m on service_m.Id = f.activities
                            where f.Id = {EventId} and f.formid=2305   ) ,
                            cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1	 where len(customtitle)>0) 
                            select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= 1;   
                            select @counter = (select count(1) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                            SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';   
                            EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT;    update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end  select* from #temptable";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Data = result.FirstOrDefault(), Message = AppMessage.Success, Status = true };
            }
            else
            {
                return new AddUpdateDelete() { Status = false };
            }

        }

        public async Task<AddUpdateDelete> GetSingleServiceDetails(string ServiceId)
        {
            string query = $@"select * from SERVICE_MASTER_1933 where Id = '{ServiceId}'";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Data = result.FirstOrDefault(), Message = AppMessage.Success, Status = true };
            }
            else
            {
                return new AddUpdateDelete() { Status = false };
            }

        }

        public async Task<AddUpdateDelete> GetSinglePublicUserAccount(string UserId)
        {
            string query = $@"SELECT publicUser.[Id]
                              ,publicUser.[USER_ID]
                              ,publicUser.[USER_EMAIL]
                              ,publicUser.[Country_Code]
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
                              ,publicUser.[SIGNUP_TYPE], publicUser.[Id]      ,publicUser.[created_at]      ,publicUser.[updated_at]      ,publicUser.[created_by]      ,publicUser.[updated_by]      ,publicUser.[USER_ID]      ,[SUBSCRIPTION_PLAN_ID]      ,account.[CURRENT_STEP]     ,[FIRST_NAME]      ,[LAST_NAME]      ,[PROFILE_PHOTO_PATH]      ,[PROFILE_PHOTO_NAME]      ,[CHINESE_NAME]      ,[NICK_NAME]      ,[GENDER]      ,[DATE_OF_BIRTH]  
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
            try
            {
                string subQuery = "";
                string ChQuery = "";

                ChQuery = $@"select USER_EMAIL from USER_MASTER_1915 where USER_EMAIL='{model.USER_EMAIL}' and USER_ID !='{model.USER_ID}'";

                List<IDictionary<string, object>> Email = await sqlFunction.ExecuteSqlQuery(ChQuery);

                if (Email.Count > 0)
                {

                    return new AddUpdateDelete() { Status = false, Message = "This email addres is already in use with diffrent user" };
                }


                ChQuery = $@"select USER_PHONE from USER_MASTER_1915 where USER_PHONE='{model.USER_PHONE}' and USER_ID !='{model.USER_ID}'";

                List<IDictionary<string, object>> Mobile = await sqlFunction.ExecuteSqlQuery(ChQuery);

                if (Mobile.Count > 0)
                {
                    return new AddUpdateDelete() { Status = false, Message = "This Phone number is already in use with diffrent user" };
                }


                if (updatePassword)
                {
                    subQuery = "USER_PASSWORD = '" + model.USER_PASSWORD + "'";
                }

                string query = $@"update PUBLIC_USER_ACCOUNT_1943 set FIRST_NAME = N'{model.FIRST_NAME}', LAST_NAME = N'{model.LAST_NAME}', CHINESE_NAME = N'{model.CHINESE_NAME}', NICK_NAME = N'{model.NICK_NAME}', GENDER = '{model.GENDER}', DATE_OF_BIRTH = '{model.DATE_OF_BIRTH.ToString("yyyy-MM-ddTHH:mm:ss")}' where USER_ID = '{model.USER_ID}'
                              update USER_MASTER_1915 set {subQuery}  USER_PHONE = '{model.USER_PHONE}',Country_Code='{model.Country_Code}' where USER_ID = '{model.USER_ID}' ";

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
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> EnrollPublicUserForCalendar(CalendarEnrollModel model, bool isServiceType = false, string PaymentId = null)
        {
            var user = await authService.GetUser(model.USER_ID, FormRole.GENERAL_USER);


            // check for sufficient B$ Balance
            var balance = await GetUserCoinBalance(model.USER_ID, model.participant.COMPANY_CODE, model.participant.CALENDAR_CODE);
            var service = await sqlFunction.ExecuteSqlQuery("select fees_1 from SERVICE_MASTER_1933 where Id = " + model.transaction.ACTIVITY);

            bool IsServicePaid = false;
            int ServiceFees = 0;

            if (!string.IsNullOrEmpty(service[0]["fees_1"]?.ToString()))
            {
                if (Convert.ToInt32(service[0]["fees_1"]) > 0)
                {
                    IsServicePaid = true;
                    ServiceFees = Convert.ToInt32(service[0]["fees_1"]);
                }
                else
                {
                    IsServicePaid = false;
                    ServiceFees = 0;
                }
            }
            else
            {
                IsServicePaid = false;
                ServiceFees = 0;
            }

            if (IsServicePaid && string.IsNullOrEmpty(PaymentId))
            {
                if (balance.Data > 0)
                {
                    if (Convert.ToInt32(balance.Data) < Convert.ToInt32(service[0]["fees_1"]))
                    {
                        return new AddUpdateDelete() { Status = false, Message = "You don't have enough credits of this calendar to book this slot." };
                    }
                    else
                    {
                        model.transaction.transaction_fees = ServiceFees.ToString();
                    }
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "You don't have enough credits of this calendar to book this slot." };
                }
            }
            else
            {
                model.transaction.transaction_fees = ServiceFees.ToString();
            }


            // check if the user limit is crossed or not
            if (!isServiceType)
            {
                List<IDictionary<string, object>> totalUsersEnrolled = await sqlFunction.ExecuteSqlQuery($@"select COUNT(*) as 'COUNT' from TRANSACTION_MASTER_1942 transaction_m
                                                                                                        join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
                                                                                                        where ACTIVITY = '{model.transaction.ACTIVITY.ToString()}'");

                List<IDictionary<string, object>> currentLimit = await sqlFunction.ExecuteSqlQuery($@"select MAXIMUM_NO_OF_PARTICIPANTS from SERVICE_MASTER_1933 where Id = '{model.transaction.ACTIVITY.ToString()}'");

                try
                {
                    if (!string.IsNullOrEmpty(currentLimit[0]["MAXIMUM_NO_OF_PARTICIPANTS"].ToString()))
                    {
                        if (Convert.ToInt32(currentLimit[0]["MAXIMUM_NO_OF_PARTICIPANTS"].ToString()) > 0)
                        {
                            if (Convert.ToInt32(totalUsersEnrolled[0]["COUNT"].ToString()) >= Convert.ToInt32(currentLimit[0]["MAXIMUM_NO_OF_PARTICIPANTS"].ToString()))
                            {
                                return new AddUpdateDelete() { Message = "LIMIT-ERROR", Status = false };
                            }
                        }
                    }

                }
                catch (Exception ex)
                {

                }
            }

            // Check if the user already exist in the participant master

            List<IDictionary<string, object>> participantCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from PARTICIPANT_MASTER_1940 where EMAIL = '{user.Data["USER_EMAIL"]}' and COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE}'");

            string StudentId = "";
            if (participantCheckResult.Count > 0)
            {
                // Participant already exist so no need to check if it is enrolled with the selected activity and resource
                StudentId = participantCheckResult.FirstOrDefault()["Id"].ToString();
                List<IDictionary<string, object>> transactionCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from TRANSACTION_MASTER_1942 where COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE}' and RESOURCE = '{model.transaction.RESOURCE}' and ACTIVITY = '{model.transaction.ACTIVITY}' and SLOT='{model.transaction.SLOT}' and student='{StudentId}'");

                if (transactionCheckResult.Count > 0)
                {
                    // user is already enrolled in the activity and resource
                    return new AddUpdateDelete() { Message = "ALREADY-ENROLLED", Status = false };
                }

            }
            else
            {
                var bookingsCheckData = await businessUserService.GetBookingsForThisMonth(model.participant.COMPANY_CODE, model.transaction.SLOT);
                if (bookingsCheckData.Status)
                {
                    if (Convert.ToInt32(bookingsCheckData.Data["AVAILABLE_BOOKINGS"]?.ToString()) == 0)
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Unable to book this event" };
                    }
                }
                else
                {
                    return bookingsCheckData;
                }

                // add entry in participant master table
                var publicUser = await GetSinglePublicUserAccount(model.USER_ID);

                model.participant.NICKNAME = publicUser.Data["NICK_NAME"].ToString();
                model.participant.EMAIL = user.Data["USER_EMAIL"].ToString();

                model.participant.ADDRESS = "";
                model.participant.GENDER = publicUser.Data["GENDER"].ToString();
                model.participant.IS_ACTIVE = "Y";
                string fullName = publicUser.Data["FIRST_NAME"].ToString() + " " + publicUser.Data["LAST_NAME"].ToString();
                if (string.IsNullOrEmpty(fullName.Trim()))
                {
                    fullName = "Tweety";
                }
                model.participant.STUDENT_NAME = fullName;

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
            data2.formGroupKey = model.FormGroupKey;
            var formResult2 = (await formAPIRepository.GeneratedFormData(data2)).Data;

            // Send Entry into Upcoming Bookings

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
                                                   ,[TO_TIME],[EVENT_ID])
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
                                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                   ,null
                                                   ,null
                                                   ,'{model.transaction.COMPANY_CODE}'
                                                   ,'{model.transaction.CALENDAR_CODE}'
                                                   ,(select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = '{model.transaction.SLOT}')                                                                                                                                                                                                     
                                                   ,N'{SQLUtility.TreatSingleQuoteForQuery(model.ACTIVITY_NAME)}'
                                                   ,N'{model.RESOURCE_NAME}'
                                                   ,N'{model.participant.STUDENT_NAME}'
                                                   ,(select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = N'{model.transaction.SLOT}') 
                                                   ,(select calendar.[end] from  CALENDAR_FORM_1935 calendar where Id = N'{model.transaction.SLOT}')
                                                   , '{model.transaction.SLOT}')";


            var upcomingResult = await sqlFunction.ExecuteSqlCommandQuery(upcomingBookingQuery);

            if (Convert.ToInt32(model.transaction.transaction_fees) > 0)
            {
                string paymentId = PaymentId;

                if (string.IsNullOrEmpty(paymentId))
                {
                    string orderNoQuery = $@"select *,
                                                    (
                                                    select case when (sum(CREDIT_COIN) - sum(DEBIT_COIN) <= 0) then 0 else sum(CREDIT_COIN) - sum(DEBIT_COIN) end from LEDGER_MASTER_1957 where ORDER_NO = PAYMENT_ID
                                                    ) as 'Balance'
                                                    from PAYMENT_HISTORY_MASTER_1956 where COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE.ToString()}' and STATUS = 'complete' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and USER_ID = '{model.USER_ID}'
                                                    order by cast(created_at as datetime)";

                    var orderNoResult = await sqlFunction.ExecuteSqlQuery(orderNoQuery);

                    paymentId = orderNoResult.FirstOrDefault(x => Convert.ToInt32(x["Balance"]) > 0)["PAYMENT_ID"]?.ToString();
                }

                // add entry in ledger
                try
                {
                    LedgerModel ledger = new LedgerModel()
                    {
                        CALENDAR_CODE = model.transaction.CALENDAR_CODE,
                        COMPANY_CODE = model.transaction.COMPANY_CODE,
                        DEBIT_COIN = Convert.ToDouble(model.transaction.transaction_fees),
                        USER_ID = model.USER_ID,
                        CREDIT_COIN = 0,
                        ORDER_NO = (model.transaction.transaction_fees == "0") ? "" : paymentId,
                        TRANSACTION_TYPE = "Booking"
                    };
                    var ledgerResult = await masterService.CreateLedgerEntry(ledger);

                }
                catch (Exception ex)
                {
                    return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
                }
            }

            try
            {

                if (formResult2.res == 1)
                {
                    return new AddUpdateDelete() { Message = "Success", Status = true, Data = formResult2.Id };
                }
                else
                {
                    return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
            }

        }

        public async Task<AddUpdateDelete> EnrollCourse(CalendarEnrollModel model, bool isServiceType = false, string PaymentId = null)
        {
            var user = await authService.GetUser(model.USER_ID, FormRole.GENERAL_USER);

            // check for sufficient B$ Balance
            var balance = await GetUserCoinBalance(model.USER_ID, model.participant.COMPANY_CODE, model.participant.CALENDAR_CODE);
            var service = await sqlFunction.ExecuteSqlQuery("select fees_1 from SERVICE_MASTER_1933 where Id = " + model.transaction.ACTIVITY);

            bool IsServicePaid = false;
            int ServiceFees = 0;

            if (!string.IsNullOrEmpty(service[0]["fees_1"]?.ToString()))
            {
                if (Convert.ToInt32(service[0]["fees_1"]) > 0)
                {
                    IsServicePaid = true;
                    ServiceFees = Convert.ToInt32(service[0]["fees_1"]);
                }
                else
                {
                    IsServicePaid = false;
                    ServiceFees = 0;
                }
            }
            else
            {
                IsServicePaid = false;
                ServiceFees = 0;
            }

            if (IsServicePaid && string.IsNullOrEmpty(PaymentId))
            {
                if (balance.Data > 0)
                {
                    if (Convert.ToInt32(balance.Data) < Convert.ToInt32(service[0]["fees_1"]))
                    {
                        return new AddUpdateDelete() { Status = false, Message = "You don't have enough credits of this calendar to book this slot." };
                    }
                    else
                    {
                        model.transaction.transaction_fees = ServiceFees.ToString();
                    }
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "You don't have enough credits of this calendar to book this slot." };
                }
            }
            else
            {
                model.transaction.transaction_fees = ServiceFees.ToString();
            }


            // check if the user limit is crossed or not
            if (!isServiceType)
            {
                List<IDictionary<string, object>> totalUsersEnrolled = await sqlFunction.ExecuteSqlQuery($@"select COUNT(*) as 'COUNT' from TRANSACTION_MASTER_1942 transaction_m
                                                                                                        join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
                                                                                                        where ACTIVITY = '{model.transaction.ACTIVITY.ToString()}'");

                List<IDictionary<string, object>> currentLimit = await sqlFunction.ExecuteSqlQuery($@"select MAXIMUM_NO_OF_PARTICIPANTS from SERVICE_MASTER_1933 where Id = '{model.transaction.ACTIVITY.ToString()}'");

                try
                {
                    if (!string.IsNullOrEmpty(currentLimit[0]["MAXIMUM_NO_OF_PARTICIPANTS"].ToString()))
                    {
                        if (Convert.ToInt32(currentLimit[0]["MAXIMUM_NO_OF_PARTICIPANTS"].ToString()) > 0)
                        {
                            if (Convert.ToInt32(totalUsersEnrolled[0]["COUNT"].ToString()) >= Convert.ToInt32(currentLimit[0]["MAXIMUM_NO_OF_PARTICIPANTS"].ToString()))
                            {
                                return new AddUpdateDelete() { Message = "LIMIT-ERROR", Status = false };
                            }
                        }
                    }

                }
                catch (Exception ex)
                {

                }
            }

            // Check if the user already exist in the participant master

            string sqlQuery = $@"select 
                                    case when (t.Id is not null and p.Id is not null) then 'Y' else 'N' end as 'IsBooked'
                                    ,f.* from CALENDAR_FORM_1935 f 
                                    left join TRANSACTION_MASTER_1942 t on f.Id = t.SLOT
                                    left join (select * from PARTICIPANT_MASTER_1940 where EMAIL = '{model.participant.EMAIL}') p on p.Id = t.STUDENT
                                    where f.IS_COURSE_EVENT = 'Y' and f.activities = '{model.transaction.ACTIVITY}' and f.[start] >= '{DateTimeUtility.Now().ToString("yyyy-MM-dd")}'";

            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                List<IDictionary<string, object>> participantCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from PARTICIPANT_MASTER_1940 where EMAIL = '{user.Data["USER_EMAIL"]}' and COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE}'");

                string StudentId = "";
                if (participantCheckResult.Count > 0)
                {
                    // Participant already exist so no need to check if it is enrolled with the selected activity and resource
                    StudentId = participantCheckResult.FirstOrDefault()["Id"].ToString();
                    List<IDictionary<string, object>> transactionCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from TRANSACTION_MASTER_1942 where COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE}' and RESOURCE = '{result[0]["resources"].ToString()}' and ACTIVITY = '{model.transaction.ACTIVITY}' and student='{StudentId}'");

                    if (transactionCheckResult.Count > 0)
                    {
                        // user is already enrolled in the activity and resource
                        return new AddUpdateDelete() { Message = "ALREADY-ENROLLED", Status = false };
                    }
                }
                else
                {
                    var bookingsCheckData = await businessUserService.GetBookingsForThisMonth(model.participant.COMPANY_CODE, result[0]["Id"]?.ToString());
                    if (bookingsCheckData.Status)
                    {
                        if (Convert.ToInt32(bookingsCheckData.Data["AVAILABLE_BOOKINGS"]?.ToString()) == 0)
                        {
                            return new AddUpdateDelete() { Status = false, Message = "Unable to book this event" };
                        }
                    }
                    else
                    {
                        return bookingsCheckData;
                    }

                    // add entry in participant master table
                    var publicUser = await GetSinglePublicUserAccount(model.USER_ID);

                    model.participant.NICKNAME = publicUser.Data["NICK_NAME"].ToString();
                    model.participant.EMAIL = user.Data["USER_EMAIL"].ToString();

                    model.participant.ADDRESS = "";
                    model.participant.GENDER = publicUser.Data["GENDER"].ToString();
                    model.participant.IS_ACTIVE = "Y";
                    string fullName = publicUser.Data["FIRST_NAME"].ToString() + " " + publicUser.Data["LAST_NAME"].ToString();
                    if (string.IsNullOrEmpty(fullName.Trim()))
                    {
                        fullName = user.Data["USER_EMAIL"].ToString();
                    }
                    model.participant.STUDENT_NAME = fullName;

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
                var formResult2 = new GenerateDynamicFormData();
                string upcomingBookingQuery = "";

                for (int i = 0; i < result.Count; i++)
                {
                    var eventDetails = result[i];
                    model.transaction.SLOT = eventDetails["Id"]?.ToString();
                    model.transaction.STUDENT = StudentId;
                    model.transaction.RESOURCE = eventDetails["resources"].ToString();
                    Form_DataTable data2 = new Form_DataTable();
                    data2.action = (int)FormAction.Save;
                    data2.formId = (int)FormSetting.TRANSACTION_MASTER;

                    data2.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.transaction.ToDictionary());
                    data2.formGroupKey = eventDetails["formGroupKey"]?.ToString();
                    formResult2 = (await formAPIRepository.GeneratedFormData(data2)).Data;

                    // Send Entry into Upcoming Bookings

                    upcomingBookingQuery += $@"INSERT INTO [dbo].[COMPANY_UPCOMING_BOOKINGS_1945]
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
                                                   ,[TO_TIME],[EVENT_ID])
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
                                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                   ,null
                                                   ,null
                                                   ,'{model.transaction.COMPANY_CODE}'
                                                   ,'{model.transaction.CALENDAR_CODE}'
                                                   ,(select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = '{model.transaction.SLOT}')                                                                                                                                                                                                     
                                                   ,N'{model.ACTIVITY_NAME}'
                                                   ,N'{model.RESOURCE_NAME}'
                                                   ,N'{model.participant.STUDENT_NAME}'
                                                   ,(select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = N'{model.transaction.SLOT}') 
                                                   ,(select calendar.[end] from  CALENDAR_FORM_1935 calendar where Id = N'{model.transaction.SLOT}')
                                                   , '{model.transaction.SLOT}')";


                }

                var upcomingResult = await sqlFunction.ExecuteSqlCommandQuery(upcomingBookingQuery);

                if (Convert.ToInt32(model.transaction.transaction_fees) > 0)
                {
                    string paymentId = PaymentId;

                    if (string.IsNullOrEmpty(paymentId))
                    {
                        string orderNoQuery = $@"select *,
                                                    (
                                                    select case when (sum(CREDIT_COIN) - sum(DEBIT_COIN) <= 0) then 0 else sum(CREDIT_COIN) - sum(DEBIT_COIN) end from LEDGER_MASTER_1957 where ORDER_NO = PAYMENT_ID
                                                    ) as 'Balance'
                                                    from PAYMENT_HISTORY_MASTER_1956 where COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE.ToString()}' and STATUS = 'complete' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and USER_ID = '{model.USER_ID}'
                                                    order by cast(created_at as datetime)";

                        var orderNoResult = await sqlFunction.ExecuteSqlQuery(orderNoQuery);

                        paymentId = orderNoResult.FirstOrDefault(x => Convert.ToInt32(x["Balance"]) > 0)["PAYMENT_ID"]?.ToString();
                    }

                    // add entry in ledger
                    try
                    {
                        LedgerModel ledger = new LedgerModel()
                        {
                            CALENDAR_CODE = model.transaction.CALENDAR_CODE,
                            COMPANY_CODE = model.transaction.COMPANY_CODE,
                            DEBIT_COIN = Convert.ToDouble(model.transaction.transaction_fees),
                            USER_ID = model.USER_ID,
                            CREDIT_COIN = 0,
                            ORDER_NO = (model.transaction.transaction_fees == "0") ? "" : paymentId,
                            TRANSACTION_TYPE = "Booking"
                        };
                        var ledgerResult = await masterService.CreateLedgerEntry(ledger);

                    }
                    catch (Exception ex)
                    {
                        return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
                    }
                }

                try
                {
                    if (formResult2.res == 1)
                    {
                        return new AddUpdateDelete() { Message = "Success", Status = true, Data = formResult2.Id };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
                    }
                }
                catch (Exception ex)
                {
                    return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
                }
            }
            else
            {
                // impossible condition
                return new AddUpdateDelete() { Message = "No events found in this course", Status = false };
            }
        }

        public async Task<AddUpdateDelete> CancelPublicUserBooking(CalendarEnrollModel model)
        {
            string query = $@"select ser.CANCELLATION_BEFORE, cf.[start], cf.[end], ser.[SERVICE_PAY_PER], t.* from CALENDAR_FORM_1935 cf
                                join TRANSACTION_MASTER_1942 t on t.SLOT = cf.Id
                                join PARTICIPANT_MASTER_1940 p on p.Id = t.STUDENT
								join SERVICE_MASTER_1933 ser on ser.Id = t.ACTIVITY
                                where cf.Id = '{model.transaction.SLOT}' and p.EMAIL = '{model.USER_EMAIL}'";
            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                int cancellationMinutes = 0;

                if (!string.IsNullOrEmpty(result[0]["CANCELLATION_BEFORE"]?.ToString()))
                {
                    try
                    {
                        cancellationMinutes = Convert.ToInt32(result[0]["CANCELLATION_BEFORE"].ToString());
                    }
                    catch (Exception ex)
                    {

                    }
                }

                if (DateTimeUtility.Now() < Convert.ToDateTime(result[0]["start"]?.ToString()).AddMinutes(-(cancellationMinutes)))
                {
                    if (result[0]["SERVICE_PAY_PER"]?.ToString() == "COURSE")
                    {
                        query = $@"update TRANSACTION_MASTER_1942 set ATTENDANCE = 'ABSENT' where Id = '{result[0]["Id"]?.ToString()}'";
                    }
                    else
                    {
                        query = $@"delete from COMPANY_UPCOMING_BOOKINGS_1945 where USER_ID = '{model.USER_ID}' and EVENT_ID = (select top 1 SLOT from TRANSACTION_MASTER_1942 where Id = '{result[0]["Id"]?.ToString()}'); delete from TRANSACTION_MASTER_1942 where Id = '{result[0]["Id"]?.ToString()}';";
                    }
                    
                    var result2 = await sqlFunction.ExecuteSqlCommandQuery(query);

                    if (result2 > 0)
                    {
                        return new AddUpdateDelete() { Status = true, Message = "Booking cancelled successfully!" };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Booking not cancelled!" };
                    }

                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Can't cancel your booking now!" };
                }
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "Booking not found" };
            }

        }

        public async Task<AddUpdateDelete> AddSessionReview(SessionReviewModel model)
        {
            string query = $@"select * from TRANSACTION_MASTER_1942 t
                            join PARTICIPANT_MASTER_1940 participant on participant.Id = t.STUDENT
                            where t.SLOT = '{model.EVENT_ID}' and participant.EMAIL = '{model.USER_EMAIL}'";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                query = $@"select * from SESSION_REVIEWS_1983 where EVENT_ID = '{model.EVENT_ID}' and USER_EMAIL = '{model.USER_EMAIL}'";
                var result2 = await sqlFunction.ExecuteSqlQuery(query);

                if (result2.Count == 0)
                {
                    Form_DataTable data2 = new Form_DataTable();
                    data2.action = (int)FormAction.Save;
                    data2.formId = (int)FormSetting.SESSION_REVIEWS;

                    data2.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
                    data2.formGroupKey = Guid.NewGuid().ToString();
                    var formResult2 = (await formAPIRepository.GeneratedFormData(data2)).Data;

                    if (formResult2.res == 1)
                    {
                        return new AddUpdateDelete() { Status = true, Message = "Thanks for the review!", Data = formResult2 };
                    }
                    else
                    {
                        return new AddUpdateDelete { Status = false, Message = "Failed to add your review at the moment. Please try again later." };
                    }

                }
                else
                {
                    return new AddUpdateDelete { Status = false, Message = "You have already reviewed this session." };
                }

            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "Transaction Not Allowed" };
            }

        }

        public async Task<AddUpdateDelete> EnrollParticipantForCalendar(CalendarFormModel model, string UserId, string UserEmail)
        {
            // Check if the user already exist in the participant master

            List<IDictionary<string, object>> participantCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from PARTICIPANT_MASTER_1940 where EMAIL = '{UserEmail}' and COMPANY_CODE = '{model.COMPANY_CODE}' and CALENDAR_CODE = '{model.CALENDAR_CODE}'");

            string StudentId = "";
            if (participantCheckResult.Count > 0)
            {
                StudentId = participantCheckResult.FirstOrDefault()["Id"].ToString();
                model.activities = StudentId;
                model.title = participantCheckResult.FirstOrDefault()["STUDENT_NAME"]?.ToString();
            }
            else
            {
                // add entry in participant master table
                var publicUser = await GetSinglePublicUserAccount(UserId);

                CalendarParticipantModel participant = new CalendarParticipantModel();

                participant.NICKNAME = publicUser.Data["NICK_NAME"].ToString();
                participant.EMAIL = UserEmail;
                participant.CALENDAR_CODE = model.CALENDAR_CODE;
                participant.COMPANY_CODE = model.COMPANY_CODE;
                participant.ADDRESS = "";
                participant.GENDER = publicUser.Data["GENDER"].ToString();
                participant.IS_ACTIVE = "Y";
                participant.STUDENT_NAME = publicUser.Data["FIRST_NAME"].ToString() + " " + publicUser.Data["LAST_NAME"].ToString();

                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.PARTICIPANT_MASTER;
                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(participant.ToDictionary());
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                if (formResult.res == 1)
                {
                    StudentId = formResult.Id.ToString();

                    model.activities = StudentId;
                    model.title = participant.STUDENT_NAME;

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

            return new AddUpdateDelete() { Status = true, Message = "Success", Data = model };
        }

        public async Task<AddUpdateDelete> BookingServiceEvent(RequestEventViewModel eventModal, string userName, string UserId, string PaymentId = null)
        {
            if (eventModal != null)
            {
                try
                {
                    var userResult = await authService.GetUser(userName, FormRole.GENERAL_USER);

                    // check for sufficient B$ Balance
                    var balance = await GetUserCoinBalance(userName, eventModal.companyCode, eventModal.calendarCode);
                    var service = await sqlFunction.ExecuteSqlQuery("select fees_1 from SERVICE_MASTER_1933 where Id = " + eventModal.activityId);

                    bool IsServicePaid = false;
                    int ServiceFees = 0;

                    if (!string.IsNullOrEmpty(service[0]["fees_1"]?.ToString()))
                    {
                        if (Convert.ToInt32(service[0]["fees_1"]) > 0)
                        {
                            IsServicePaid = true;
                            ServiceFees = Convert.ToInt32(service[0]["fees_1"]);
                        }
                        else
                        {
                            IsServicePaid = false;
                            ServiceFees = 0;
                        }
                    }
                    else
                    {
                        IsServicePaid = false;
                        ServiceFees = 0;
                    }

                    if (IsServicePaid && string.IsNullOrEmpty(PaymentId))
                    {
                        if (balance.Data > 0)
                        {
                            if (Convert.ToInt32(balance.Data) < Convert.ToInt32(service[0]["fees_1"]))
                            {
                                return new AddUpdateDelete() { Status = false, Message = "You don't have enough credits of this calendar to book this slot." };
                            }
                        }
                        else
                        {
                            return new AddUpdateDelete() { Status = false, Message = "You don't have enough credits of this calendar to book this slot." };
                        }
                    }


                    if (userResult.Status)
                    {
                        var userData = userResult.Data as IDictionary<string, object>;
                        string user_email = userData["USER_EMAIL"]?.ToString() ?? "";
                        List<IDictionary<string, object>> participantCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from PARTICIPANT_MASTER_1940 where EMAIL = '{user_email}' and COMPANY_CODE = '{eventModal.companyCode}' and CALENDAR_CODE = '{eventModal.calendarCode}'");


                        string StudentId = "";
                        if (participantCheckResult.Count > 0)
                        {
                            StudentId = participantCheckResult.FirstOrDefault()["Id"].ToString();
                        }
                        else
                        {
                            var publicUser = await GetSinglePublicUserAccount(userName);
                            var publicUserData = publicUser.Data as IDictionary<string, object>;
                            IDictionary<string, object> participant = new Dictionary<string, object>();
                            participant["NICKNAME"] = publicUserData["NICK_NAME"]?.ToString() ?? "";
                            participant["EMAIL"] = user_email;
                            participant["CALENDAR_CODE"] = eventModal.calendarCode;
                            participant["COMPANY_CODE"] = eventModal.companyCode;
                            participant["ADDRESS"] = "";
                            participant["GENDER"] = publicUserData["GENDER"]?.ToString() ?? "";
                            participant["IS_ACTIVE"] = "Y";
                            participant["STUDENT_NAME"] = (publicUserData["FIRST_NAME"]?.ToString() ?? "" + " " + publicUserData["LAST_NAME"]?.ToString() ?? "").Trim();

                            Form_DataTable data = new Form_DataTable();
                            data.action = (int)FormAction.Save;
                            data.formId = (int)FormSetting.PARTICIPANT_MASTER;

                            data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(participant);
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

                        int eventId = 0;
                        string formGroupKey = Guid.NewGuid().ToString();
                        if (eventModal.isSlotBooking)
                        {
                            string _sqlstring = @"select *from CALENDAR_FORM_1935 where Id=" + eventModal.eventId;
                            var _result = await sqlFunction.ExecuteSqlQuery(_sqlstring);
                            if (_result != null && _result.Count() > 0)
                            {

                                var _eventData = _result.FirstOrDefault();
                                formGroupKey = _eventData["formGroupKey"].ToString();

                                List<int> customForms = new List<int>();
                                List<int> customFormIds = new List<int>();
                                customForms.Add(eventModal.resourceFormId);
                                customForms.Add(eventModal.activityFormId);
                                customForms.Add(eventModal.otherActivityformId);
                                customForms.Add((int)FormSetting.PARTICIPANT_MASTER);

                                customFormIds.Add(eventModal.resourceId);
                                customFormIds.Add(eventModal.activityId);
                                customFormIds.Add(eventModal.otherActivityId);
                                customFormIds.Add(Convert.ToInt32(StudentId));

                                FormCalenderReferrenceTable request2 = new FormCalenderReferrenceTable()
                                {
                                    customForms = string.Join(",", customForms),
                                    customFormIds = string.Join(",", customFormIds),
                                    action = 11,
                                    formId = (int)FormSetting.CALENDAR_FORM,
                                    formGroupKey = formGroupKey,
                                    created_by = (int)FormSetting.CreatedUser,
                                    updated_by = (int)FormSetting.CreatedUser
                                };

                                await formAPIRepository.ManageCalenderReferrenceNew(request2);
                                eventId = eventModal.eventId;
                                _sqlstring = @"update CALENDAR_FORM_1935 set EVENT_TYPE='BOOKING' where Id=" + eventId;
                                await sqlFunction.ExecuteSqlCommandQuery(_sqlstring);
                            }
                        }
                        else
                        {
                            Form_DataTable request = new Form_DataTable();

                            request.currentFormType = 1;
                            request.IsMaxOneRecordPerUser = false;
                            request.action = (int)FormAction.Save;
                            request.userId = (int)FormSetting.CreatedUser;
                            request.formId = (int)FormSetting.CALENDAR_FORM;
                            request.resourceFormId = eventModal.resourceFormId;
                            request.ActivityFormId = eventModal.activityFormId;
                            request.topicId = 1935;
                            request.created_by = (int)FormSetting.CreatedUser;
                            request.updated_by = (int)FormSetting.CreatedUser;
                            request.formGroupKey = formGroupKey;
                            var start = Convert.ToDateTime(eventModal.start);
                            var end = Convert.ToDateTime(eventModal.end);

                            var eventData = new { start = start, end = end, allDay = false, EVENT_TYPE = "BOOKING", description = "", resources = eventModal.resourceId, activities = eventModal.activityId, formGroupKey = formGroupKey, COMPANY_CODE = eventModal.companyCode, CALENDAR_CODE = eventModal.calendarCode }.ToDictionary();
                            eventData["resources_" + eventModal.resourceFormId] = eventModal.resourceId;
                            eventData["activities_" + eventModal.activityFormId] = eventModal.activityId;
                            eventData["activities_" + eventModal.otherActivityformId] = eventModal.otherActivityId;
                            eventData["activities_" + (int)FormSetting.PARTICIPANT_MASTER] = Convert.ToInt32(StudentId);

                            request.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(eventData);

                            GenerateDynamicFormData eventResponse = (await formAPIRepository.GeneratedFormData(request)).Data;
                            eventModal.eventId = eventResponse.Id;

                            List<int> customForms = new List<int>();
                            List<int> customFormIds = new List<int>();
                            customForms.Add(eventModal.resourceFormId);
                            customForms.Add(eventModal.activityFormId);
                            customForms.Add(eventModal.otherActivityformId);
                            customForms.Add((int)FormSetting.PARTICIPANT_MASTER);

                            customFormIds.Add(eventModal.resourceId);
                            customFormIds.Add(eventModal.activityId);
                            customFormIds.Add(eventModal.otherActivityId);
                            customFormIds.Add(Convert.ToInt32(StudentId));

                            FormCalenderReferrenceTable request2 = new FormCalenderReferrenceTable()
                            {
                                customForms = string.Join(",", customForms),
                                customFormIds = string.Join(",", customFormIds),
                                action = 11,
                                formId = (int)FormSetting.CALENDAR_FORM,
                                formGroupKey = formGroupKey,
                                created_by = (int)FormSetting.CreatedUser,
                                updated_by = (int)FormSetting.CreatedUser
                            };
                            await formAPIRepository.ManageCalenderReferrenceNew(request2);

                        }

                        if (eventModal.eventId != 0)
                        {
                            IDictionary<string, object> transaction = new Dictionary<string, object>();

                            transaction["SLOT"] = eventModal.eventId;
                            transaction["RESOURCE"] = eventModal.resourceId;
                            transaction["ACTIVITY"] = eventModal.activityId;
                            transaction["STUDENT"] = StudentId;
                            transaction["REMARKS"] = "";
                            transaction["transaction_fees"] = ServiceFees.ToString();
                            transaction["ATTENDANCE"] = "YES";
                            transaction["COMPANY_CODE"] = eventModal.companyCode;
                            transaction["CALENDAR_CODE"] = eventModal.calendarCode;

                            Form_DataTable transaction_req = new Form_DataTable();
                            transaction_req.action = (int)FormAction.Save;
                            transaction_req.formId = (int)FormSetting.TRANSACTION_MASTER;

                            transaction_req.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(transaction);
                            transaction_req.formGroupKey = formGroupKey;
                            var formResult2 = (await formAPIRepository.GeneratedFormData(transaction_req)).Data;


                            IDictionary<string, string> upCommingBooking = new Dictionary<string, string>();

                            upCommingBooking["COMPANY_CODE"] = eventModal.companyCode.ToString();
                            upCommingBooking["CALENDAR_CODE"] = eventModal.calendarCode.ToString();
                            upCommingBooking["EVENT_ID"] = eventModal.eventId.ToString();

                            upCommingBooking["ACTIVITY_NAME"] = eventModal.activityTitle;
                            upCommingBooking["RESOURCE_NAME"] = eventModal.resourceTitle;
                            upCommingBooking["STUDENT_NAME"] = userData["FIRST_NAME"]?.ToString() ?? "";

                            var upcommingBookingResult = await UpCommingBookingAdd(upCommingBooking);

                            if (ServiceFees > 0)
                            {
                                string paymentId = PaymentId;

                                if (string.IsNullOrEmpty(paymentId))
                                {
                                    string orderNoQuery = $@"select *,
                                                    (
                                                    select case when (sum(CREDIT_COIN) - sum(DEBIT_COIN) <= 0) then 0 else sum(CREDIT_COIN) - sum(DEBIT_COIN) end from LEDGER_MASTER_1957 where ORDER_NO = PAYMENT_ID
                                                    ) as 'Balance'
                                                    from PAYMENT_HISTORY_MASTER_1956 where COMPANY_CODE = '{eventModal.companyCode.ToString()}' and CALENDAR_CODE = '{eventModal.calendarCode.ToString()}' and STATUS = 'complete' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and USER_ID = '{userName}'
                                                    order by cast(created_at as datetime)";

                                    var orderNoResult = await sqlFunction.ExecuteSqlQuery(orderNoQuery);

                                    paymentId = orderNoResult.FirstOrDefault(x => Convert.ToInt32(x["Balance"]) > 0)["PAYMENT_ID"]?.ToString();
                                }


                                // add entry in ledger
                                LedgerModel ledger = new LedgerModel()
                                {
                                    CALENDAR_CODE = eventModal.calendarCode.ToString(),
                                    COMPANY_CODE = eventModal.companyCode.ToString(),
                                    DEBIT_COIN = Convert.ToDouble(ServiceFees),
                                    USER_ID = userName,
                                    CREDIT_COIN = 0,
                                    ORDER_NO = paymentId,
                                    TRANSACTION_TYPE = "Booking"
                                };

                                var ledgerResult = await masterService.CreateLedgerEntry(ledger);
                            }


                            return new AddUpdateDelete() { Status = true, Message = "Success", Data = formResult2.Id };
                        }
                        else
                        {
                            return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
                        }
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = "No Data Found" };
                    }
                }
                catch (Exception ex)
                {
                    return new AddUpdateDelete() { Status = false, Message = ex.Message };
                }
            }
            return new AddUpdateDelete() { Status = false, Message = "Invalid response!" };
        }

        public async Task<AddUpdateDelete> CreateDynamicFormEntry(List<IDictionary<string, string>> model, string formId, string UserId, string CalendarCode)
        {
            try
            {
                List<string> requestList = new List<string>();
                List<string> formGroupKeyListTemp = new List<string>();
                Dictionary<string, object> sd = new Dictionary<string, object>();

                var assign = model.FirstOrDefault();

                foreach (KeyValuePair<string, string> keyValuePair in assign)
                {
                    if (keyValuePair.Key != "Is_New" && keyValuePair.Key != "Id")
                    {
                        sd.Add(keyValuePair.Key, keyValuePair.Value.ToString());
                    }

                }

                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = Convert.ToInt32(formId);
                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(sd);
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                if (formResult.res > 0)
                {
                    string tableName = (await CheckAdditionalFormDetails(CalendarCode, UserId)).Data;
                    string query = $@"update {tableName} set created_by = '{UserId}' where Id = '{formResult.Id}'";
                    var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                    if (result > 0)
                    {
                        return new AddUpdateDelete() { Status = true, Message = "Form saved successfully!" };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = "Form not saved!" };
                    }

                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Form not saved. Please try again!" };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> MarkPresent(string EventId, string UserEmail)
        {
            try
            {
                string query = $@"select cf.[start], cf.[end], t.* from TRANSACTION_MASTER_1942 t
                                  join CALENDAR_FORM_1935 cf on cf.Id = t.SLOT
								  join PARTICIPANT_MASTER_1940 part on part.Id = t.STUDENT
                                  where t.SLOT = '{EventId}' and part.EMAIL = '{UserEmail}'";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    if (result[0]["ATTENDANCE"]?.ToString() == "PRESENT")
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Attendance already marked as present!" };
                    }
                    else
                    {
                        if (DateTimeUtility.Now() <= Convert.ToDateTime(result[0]["end"]?.ToString()) && DateTimeUtility.Now() >= Convert.ToDateTime(result[0]["start"]?.ToString()).AddMinutes(-30))
                        {
                            query = $@"update TRANSACTION_MASTER_1942 set ATTENDANCE = 'PRESENT' where Id = '{result[0]["Id"].ToString()}'";
                            var result2 = await sqlFunction.ExecuteSqlCommandQuery(query);

                            if (result2 > 0)
                            {
                                return new AddUpdateDelete() { Status = true, Message = "Attendance marked successfully!" };
                            }
                            else
                            {
                                return new AddUpdateDelete() { Status = false, Message = "Attendance not marked. Ask the company to mark your attendance." };
                            }

                        }
                        else
                        {
                            return new AddUpdateDelete() { Status = false, Message = "Can't mark the attendance now." };
                        }
                    }
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "You are not enrolled in this event!" };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> MarkPresentByCompany(string TransactionId, string EventId)
        {
            try
            {
                string query = $@"select cf.[start], cf.[end], t.* from TRANSACTION_MASTER_1942 t
                                  join CALENDAR_FORM_1935 cf on cf.Id = t.SLOT
                                  where t.Id = '{TransactionId}' and t.SLOT = '{EventId}'";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    if (result[0]["ATTENDANCE"]?.ToString() == "PRESENT")
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Attendance already marked as present!" };
                    }
                    else
                    {
                        query = $@"update TRANSACTION_MASTER_1942 set ATTENDANCE = 'PRESENT' where Id = '{result[0]["Id"].ToString()}'";
                        var result2 = await sqlFunction.ExecuteSqlCommandQuery(query);

                        if (result2 > 0)
                        {
                            return new AddUpdateDelete() { Status = true, Message = "Attendance marked successfully!" };
                        }
                        else
                        {
                            return new AddUpdateDelete() { Status = false, Message = "Attendance not marked. Ask the Attendee to mark through company's QR." };
                        }
                    }
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "QR Code does not belong to selected event." };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        private async Task<int> UpCommingBookingAdd(IDictionary<string, string> data)
        {

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
                                                   ,[TO_TIME],[EVENT_ID])
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
                                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                   ,null
                                                   ,null
                                                   ,'{data["COMPANY_CODE"]}'
                                                   ,'{data["CALENDAR_CODE"]}'
                                                   , (select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = {data["SLOT"]})                                                                                                                                                                                                     
                                                   , N'{data["ACTIVITY_NAME"]}'
                                                   , N'{data["RESOURCE_NAME"]}'
                                                   , N'{data["STUDENT_NAME"]}'
                                                   , (select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = {data["SLOT"]}) 
                                                   , (select calendar.[end] from  CALENDAR_FORM_1935 calendar where Id = {data["SLOT"]})
                                                   , '{data["SLOT"]}')";


            return await sqlFunction.ExecuteSqlCommandQuery(upcomingBookingQuery);
        }

        public async Task<AddUpdateDelete> AddFavoriteCalendar(FavoriteCalendarModel model)
        {
            string query = $@"select * from FAVORITE_CALENDAR_MASTER_1949 where USER_ID = '{model.USER_ID}' and CALENDAR_CODE = '{model.CALENDAR_CODE}' and COMPANY_CODE = '{model.COMPANY_CODE}'";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Message = AppMessage.Success, Status = true };
            }

            Form_DataTable data = new Form_DataTable();
            data.action = (int)FormAction.Save;
            data.formId = (int)FormSetting.FAVORITE_CALENDAR_MASTER;

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

        public async Task<AddUpdateDelete> RemoveFavoriteCalendar(FavoriteCalendarModel model)
        {
            try
            {

                string query = $@"delete from FAVORITE_CALENDAR_MASTER_1949 where USER_ID = '{model.USER_ID}' and CALENDAR_CODE = '{model.CALENDAR_CODE}' and COMPANY_CODE = '{model.COMPANY_CODE}'";

                int result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (result > 0)
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

        public async Task<AddUpdateDelete> GetAllEnrolledCompaniesData(string userEmail, bool IsDistinct = true)
        {
            try
            {
                string Distinct = (!IsDistinct) ? ", calendar.[CALENDAR_CODE], calendar.[start] as 'Date', transaction_m.RESOURCE" : "";

                string query = $@"SELECT distinct calendar.[COMPANY_CODE], company.COMPANY_NAME_ENGLISH {Distinct}
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

        public async Task<AddUpdateDelete> GetRecentlyBookedCalendars(string userEmail, string userId)
        {
            try
            {
                //                string query = $@"declare @Ids varchar(max) = stuff((SELECT distinct ',' + cast(calendarDetails.Id as varchar)
                //                                  FROM [dbo].[CALENDAR_FORM_1935] calendar
                //                                  join TRANSACTION_MASTER_1942 transaction_m on calendar.CALENDAR_CODE = transaction_m.CALENDAR_CODE
                //                                  join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
                //								  join SERVICE_MASTER_1933 service_m on service_m.Id = transaction_m.ACTIVITY
                //                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
                //								  join BUSINESS_CALENDAR_MASTER_1925 calendarDetails on calendarDetails.CALENDAR_CODE = calendar.CALENDAR_CODE
                //								  join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendarDetails.CALENDAR_SUB_CATEGORY_ID
                //                                  where EMAIL = '{userEmail}' and calendar.Id = transaction_m.SLOT
                //								  for xml path('')), 1, 1, '')

                //								  select top 4
                //									  (select 
                //	case when (
                //		(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 where USER_ID = '{userId}' and CALENDAR_CODE = calendarDetails.CALENDAR_CODE and getdate() < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN)
                //	) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 where USER_ID = '{userId}' and CALENDAR_CODE = calendarDetails.CALENDAR_CODE and getdate() < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN) <= 0
                //	then
                //		0
                //	else
                //		(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 where USER_ID = '{userId}' and CALENDAR_CODE = calendarDetails.CALENDAR_CODE and getdate() < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN)
                //	end
                //FROM LEDGER_MASTER_1957 led 
                //where USER_ID = '{userId}' and CALENDAR_CODE = calendarDetails.CALENDAR_CODE ) as 'COIN_BALANCE'
                //									  ,company.Id as 'CompanyId'
                //                                      ,calendarDetails.*
                //	                                  ,company.COMPANY_NAME_ENGLISH
                //									  , calendarDetails.CALENDAR_NAME
                //                                      ,company.COMPANY_LOGO_PATH
                //                                      ,subCategory.CALENDAR_SUB_CATEGORY_NAME
                //									  ,stuff( (select distinct ',' + ACTIVITY_NAME from SERVICE_MASTER_1933 service_m where service_m.CALENDAR_CODE = calendarDetails.CALENDAR_CODE for xml path('')), 1, 1, '') as 'ServiceList'
                //									  FROM BUSINESS_CALENDAR_MASTER_1925 calendarDetails
                //                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendarDetails.COMPANY_CODE
                //								  join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendarDetails.CALENDAR_SUB_CATEGORY_ID
                //                                  where calendarDetails.Id in (select cast(item as integer) from dbo.SplitString(@Ids, ','))";




                string query = $@"declare @Ids varchar(max) = stuff((SELECT distinct ',' + cast(calendarDetails.Id as varchar)
                                  FROM [dbo].[CALENDAR_FORM_1935] calendar
                                  join TRANSACTION_MASTER_1942 transaction_m on calendar.CALENDAR_CODE = transaction_m.CALENDAR_CODE
                                  join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
								  join SERVICE_MASTER_1933 service_m on service_m.Id = transaction_m.ACTIVITY
                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
								  join BUSINESS_CALENDAR_MASTER_1925 calendarDetails on calendarDetails.CALENDAR_CODE = calendar.CALENDAR_CODE
								  join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory   ON ',' + calendarDetails.CALENDAR_SUB_CATEGORY_ID + ',' LIKE '%,' + CAST(subCategory.Id AS NVARCHAR(MAX)) + ',%'
                                  where EMAIL = '{userEmail}' and calendar.Id = transaction_m.SLOT
								  for xml path('')), 1, 1, '')

								  select top 4
									  (select 
	case when (
		(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = '{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN)
	) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = '{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN) <= 0
	then
		0
	else
		(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = '{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN)
	end
FROM LEDGER_MASTER_1957 led 
join ORDER_MASTER_1969 ord on ord.ORDER_NO = led.ORDER_NO
where ord.ORDER_TYPE = 'PACKAGE' and led.USER_ID = '{userId}' and led.CALENDAR_CODE = calendarDetails.CALENDAR_CODE ) as 'COIN_BALANCE'
									  ,company.Id as 'CompanyId'
                                      ,calendarDetails.*
	                                  ,company.COMPANY_NAME_ENGLISH
									  , calendarDetails.CALENDAR_NAME
                                      ,company.COMPANY_LOGO_PATH
                                  
									  ,stuff( (select distinct ',' + ACTIVITY_NAME from SERVICE_MASTER_1933 service_m where service_m.CALENDAR_CODE = calendarDetails.CALENDAR_CODE for xml path('')), 1, 1, '') as 'ServiceList'
									  FROM BUSINESS_CALENDAR_MASTER_1925 calendarDetails
                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendarDetails.COMPANY_CODE
								  
                                  where calendarDetails.Id in (select cast(item as integer) from dbo.SplitString(@Ids, ','))";






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

        public async Task<AddUpdateDelete> CheckSingleMyFavoriteCalendar(string userId, string CalendarCode = null)
        {
            try
            {
                string query0 = $@"SELECT [Id]
                                          ,[created_at]
                                          ,[updated_at]
                                          ,[created_by]
                                          ,[updated_by]
                                          ,[COMPANY_CODE]
                                          ,[CALENDAR_CODE]
                                          ,[USER_ID]
                                          ,[IS_PUBIC_USER]
                                      FROM [dbo].[FAVORITE_CALENDAR_MASTER_1949] where USER_ID = '{userId}' and CALENDAR_CODE = '{CalendarCode}' ";

                List<IDictionary<string, object>> result0 = await sqlFunction.ExecuteSqlQuery(query0);

                if (result0.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
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

        public async Task<AddUpdateDelete> GetMyFavoriteCalendars(GenerateDynamicFormData data, string userId, string CalendarCode = null)
        {
            try
            {
                string CompanyCode = data.COMPANY_CODE;
                string CompanyLogic = "";

                if (!string.IsNullOrEmpty(CompanyCode))
                {
                    CompanyLogic = " and calendarDetails.COMPANY_CODE = '" + CompanyCode + "'";
                }

                string query0 = $@"SELECT [Id]
                                          ,[created_at]
                                          ,[updated_at]
                                          ,[created_by]
                                          ,[updated_by]
                                          ,[COMPANY_CODE]
                                          ,[CALENDAR_CODE]
                                          ,[USER_ID]
                                          ,[IS_PUBIC_USER]
                                      FROM [dbo].[FAVORITE_CALENDAR_MASTER_1949] calendarDetails where USER_ID = '{userId}' {CompanyLogic} ";

                List<IDictionary<string, object>> result0 = await sqlFunction.ExecuteSqlQuery(query0);

                string calendarCodes = "";

                if (result0.Count > 0)
                {
                    for (int i = 0; i < result0.Count; i++)
                    {
                        if (i == result0.Count - 1)
                        {
                            calendarCodes += "'" + result0[i]["CALENDAR_CODE"].ToString() + "'";
                        }
                        else
                        {
                            calendarCodes += "'" + result0[i]["CALENDAR_CODE"].ToString() + "'" + ", ";
                        }
                    }
                }

                if (!string.IsNullOrEmpty(CalendarCode))
                {
                    calendarCodes = (CalendarCode.Contains("'")) ? CalendarCode : "'" + CalendarCode + "'";
                }


                string column = "", dir = "";
                if (data.sorters != null && data.sorters.Count() > 0)
                {
                    column = data.sorters.FirstOrDefault().field;
                    dir = data.sorters.FirstOrDefault().dir;
                }
                else
                {
                    column = "created_at";
                    dir = "desc";
                }

                int PageSize = data.size > 0 ? data.size : 20;
                int PageNumber = data.page > 0 ? data.page : 1;               

                string query = $@"declare @CalendarCodes varchar(max) = (select stuff((select distinct ',' + CALENDAR_CODE  from PAYMENT_HISTORY_MASTER_1956 payment 
											  where payment.STATUS = 'complete' and payment.USER_ID = '{userId}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd")}' < payment.CREDIT_EXPIRE_DATE
											  for xml path('')), 1, 1, '')) 
                                  declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                              

                                              SELECT distinct calendarDetails.[COMPANY_CODE]
                                                  ,calendarDetails.[CALENDAR_CODE]
	                                              ,calendarDetails.[Id] 
                                                  ,calendarDetails.[created_at] 
                                                  ,company.Id as 'CompanyId'
                                                  ,calendarDetails.[CALENDAR_NAME]
                                                  ,calendarDetails.[CALENDAR_PHOTO_NAME]
                                                  ,calendarDetails.[CALENDAR_PHOTO_PATH]
                                                  ,calendarDetails.[CALENDAR_CATEGORY_ID]
                                                  ,calendarDetails.[CALENDAR_SUB_CATEGORY_ID]
                                                  ,calendarDetails.[TAGS]
	                                              ,company.COMPANY_NAME_ENGLISH
                                                  ,company.COMPANY_LOGO_PATH
                                                  --,subCategory.CALENDAR_SUB_CATEGORY_NAME
												  ,(select 
	case when (
		(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = '{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN)
	) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = '{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN) <= 0
	then
		0
	else
		(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = '{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN)
	end
FROM LEDGER_MASTER_1957 led 
join ORDER_MASTER_1969 ord on ord.ORDER_NO = led.ORDER_NO
where ord.ORDER_TYPE = 'PACKAGE' and led.USER_ID = '{userId}' and led.CALENDAR_CODE = calendarDetails.CALENDAR_CODE ) as 'COIN_BALANCE', 'Y' as 'PURCHASED'
                                              FROM [dbo].BUSINESS_CALENDAR_MASTER_1925 calendarDetails
                                              join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendarDetails.COMPANY_CODE
								              --join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory ON ',' + calendarDetails.CALENDAR_SUB_CATEGORY_ID + ',' LIKE '%,' + CAST(subCategory.Id AS NVARCHAR(MAX)) + ',%'
											  where calendarDetails.CALENDAR_CODE in (select cast(item as varchar) from dbo.SplitString(@CalendarCodes, ',')) {CompanyLogic}
                                              Union all
                                              SELECT distinct calendarDetails.[COMPANY_CODE]
                                                  ,calendarDetails.[CALENDAR_CODE]
	                                              ,calendarDetails.[Id] 
                                                  ,calendarDetails.[created_at] 
                                                  ,company.Id as 'CompanyId'
                                                  ,calendarDetails.[CALENDAR_NAME]
                                                  ,calendarDetails.[CALENDAR_PHOTO_NAME]
                                                  ,calendarDetails.[CALENDAR_PHOTO_PATH]
                                                  ,calendarDetails.[CALENDAR_CATEGORY_ID]
                                                  ,calendarDetails.[CALENDAR_SUB_CATEGORY_ID]
                                                  ,calendarDetails.[TAGS]
	                                              ,company.COMPANY_NAME_ENGLISH
                                                  ,company.COMPANY_LOGO_PATH
                                                  ,0 as 'COIN_BALANCE'
                                                  ,'N' as 'PURCHASED'
                                              FROM [dbo].BUSINESS_CALENDAR_MASTER_1925 calendarDetails
                                              join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendarDetails.COMPANY_CODE
                                              where {((string.IsNullOrEmpty(calendarCodes)) ? "calendarDetails.CALENDAR_CODE = ''" : $@"calendarDetails.CALENDAR_CODE in ({calendarCodes})")} and calendarDetails.CALENDAR_CODE not in (select cast(item as varchar) from dbo.SplitString(@CalendarCodes, ',')) 
                                      )
                                  Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY PURCHASED desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";



                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                string query2 = $@"declare @CompanyCodes varchar(max) = (select stuff((select distinct ',' + COMPANY_CODE  from PAYMENT_HISTORY_MASTER_1956 payment 
											  where payment.STATUS = 'complete' and payment.USER_ID = '{userId}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd")}' < payment.CREDIT_EXPIRE_DATE
											  for xml path('')), 1, 1, '')) 

											  SELECT distinct company.[COMPANY_CODE],company.[Id]
												,[COMPANY_NAME_ENGLISH]
												FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
												where company.COMPANY_CODE in (select cast(item as varchar) from dbo.SplitString(@CompanyCodes, ','))
                                            Union all
									  SELECT distinct company.[COMPANY_CODE],company.[Id]
                                          ,[COMPANY_NAME_ENGLISH]
                                      FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                      join FAVORITE_CALENDAR_MASTER_1949 favorite on favorite.COMPANY_CODE = company.COMPANY_CODE
                                      where favorite.USER_ID = '{userId}' and company.COMPANY_CODE not in (select cast(item as varchar) from dbo.SplitString(@CompanyCodes, ','))

                                      ";

                List<IDictionary<string, object>> result2 = await sqlFunction.ExecuteSqlQuery(query2);


                List<List<IDictionary<string, object>>> finalResult = new List<List<IDictionary<string, object>>>();

                finalResult.Add(result);
                finalResult.Add(result2);

                if (finalResult.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = finalResult };
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

        public async Task<AddUpdateDelete> GetUserBCoinMaster(GenerateDynamicFormData data, string userName, string userEmail)
        {
            try
            {
                string CompanyCode = data.COMPANY_CODE;
                string CompanyLogic = "";

                if (!string.IsNullOrEmpty(CompanyCode))
                {
                    CompanyLogic = " and calendarDetails.COMPANY_CODE = '" + CompanyCode + "'";
                }

                string column = "", dir = "";
                if (data.sorters != null && data.sorters.Count() > 0)
                {
                    column = data.sorters.FirstOrDefault().field;
                    dir = data.sorters.FirstOrDefault().dir;
                }
                else
                {
                    column = "created_at";
                    dir = "desc";
                }

                int PageSize = data.size > 0 ? data.size : 20;
                int PageNumber = data.page > 0 ? data.page : 1;

                string query = $@"declare @UserId varchar(max) = '{userName}'
                                  declare @currentDate varchar(100) = '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                  declare @Ids varchar(max) = stuff((select distinct ',' + phm.CALENDAR_CODE

								  from PAYMENT_HISTORY_MASTER_1956 phm
								  join ORDER_MASTER_1969 ord on ord.ORDER_NO = phm.PAYMENT_ID
								  where phm.USER_ID = @UserId and cast(@currentDate as datetime) <= cast(phm.CREDIT_EXPIRE_DATE as datetime) and phm.STATUS = 'complete'
								  and ord.ORDER_TYPE = 'PACKAGE'
								  for xml path('')), 1, 1, '')
			  
                                  declare @PageSize int=10 ,  @PageNumber int=1 ; with formdata as (
                                              select
									  (select 
											case when (
												(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = @UserId and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)) - SUM(led.DEBIT_COIN) - SUM(led.DEBIT_COIN)
											) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = @UserId and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)) - SUM(led.DEBIT_COIN) - SUM(led.DEBIT_COIN) <= 0
											then
												0
											else
												(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = @UserId and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)) - SUM(led.DEBIT_COIN)
											end
										FROM LEDGER_MASTER_1957 led 
										join ORDER_MASTER_1969 ord on ord.ORDER_NO = led.ORDER_NO
										where  ord.ORDER_TYPE = 'PACKAGE' and led.USER_ID = @UserId and led.CALENDAR_CODE = calendarDetails.CALENDAR_CODE ) as 'COIN_BALANCE'
									  
									  
									  ,(select CREDIT_EXPIRE_DATE,
										(
										select case when (sum(CREDIT_COIN) - sum(DEBIT_COIN) <= 0) then 0 else cast(sum(CREDIT_COIN) - sum(DEBIT_COIN) as varchar) end from LEDGER_MASTER_1957 where ORDER_NO = pay.PAYMENT_ID
										) as 'Balance'
										from PAYMENT_HISTORY_MASTER_1956 pay
										join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID
										where ord.ORDER_TYPE = 'PACKAGE' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and pay.USER_ID = @UserId and pay.STATUS = 'complete' and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)
									   for json auto) as 'PackageInfo'
									  ,company.Id as 'CompanyId'
                                      ,calendarDetails.*
	                                  ,company.COMPANY_NAME_ENGLISH
                                      ,company.COMPANY_LOGO_PATH
                                      --d,subCategory.CALENDAR_SUB_CATEGORY_NAME
									  ,stuff( (select distinct ',' + ACTIVITY_NAME from SERVICE_MASTER_1933 service_m where service_m.CALENDAR_CODE = calendarDetails.CALENDAR_CODE for xml path('')), 1, 1, '') as 'ServiceList'
									  FROM BUSINESS_CALENDAR_MASTER_1925 calendarDetails
                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendarDetails.COMPANY_CODE

								  --join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory ON ',' + calendarDetails.CALENDAR_SUB_CATEGORY_ID + ',' LIKE '%,' + CAST(subCategory.Id AS NVARCHAR(MAX)) + ',%'
                                  where calendarDetails.CALENDAR_CODE in (select cast(item as varchar(max)) from dbo.SplitString(@Ids, ',')) {CompanyLogic}

								  )
                                  Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY created_at desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";




                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                string query2 = $@"declare @UserId varchar(max) = '{userName}'
                                  declare @currentDate varchar(100) = '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                  declare @Ids varchar(max) = stuff((select distinct ',' + phm.COMPANY_CODE

								  from PAYMENT_HISTORY_MASTER_1956 phm
                                  join ORDER_MASTER_1969 ord on ord.ORDER_NO = phm.PAYMENT_ID
								  where phm.USER_ID = @UserId and cast(@currentDate as datetime) <= cast(phm.CREDIT_EXPIRE_DATE as datetime) and phm.STATUS = 'complete' and ord.ORDER_TYPE = 'PACKAGE'
								  for xml path('')), 1, 1, '')
								  
								  select * from BUSINESS_COMPANY_MASTER_1924 where COMPANY_CODE in (select cast(item as varchar) from dbo.SplitString(@Ids, ','))
                                      ";

                List<IDictionary<string, object>> result2 = await sqlFunction.ExecuteSqlQuery(query2);


                List<List<IDictionary<string, object>>> finalResult = new List<List<IDictionary<string, object>>>();

                finalResult.Add(result);
                finalResult.Add(result2);

                if (finalResult.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = finalResult };
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

        public async Task<AddUpdateDelete> CheckAdditionalFormDetails(string CalendarCode, string UserId)
        {
            try
            {
                string query = $@"select dbo.CheckBookingAdditionalFormDetails('{CalendarCode}') as Result";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {

                    if (result[0]["Result"]?.ToString() == "false")
                    {
                        query = $@"select replace(t.topicTitle, ' ', '_') + '_' + cast(f.topicID as varchar(6)) as TableName from form f
                                    join topic t on t.topicID = f.topicID
                                    where f.formID = (select ADDITIONAL_FORM_ID from BUSINESS_CALENDAR_MASTER_1925 where CALENDAR_CODE = '{CalendarCode}')";
                        var TableNameRaw = await sqlFunction.ExecuteSqlQuery(query);

                        string TableName = "";

                        if (TableNameRaw.Count > 0)
                        {
                            TableName = TableNameRaw[0]["TableName"]?.ToString();

                            query = $@"select * from {TableName} where created_by = '{UserId}' and COMPANY_CODE = (select COMPANY_CODE from BUSINESS_CALENDAR_MASTER_1925 where CALENDAR_CODE = '{CalendarCode}')";

                            result = await sqlFunction.ExecuteSqlQuery(query);

                            if (result.Count > 0)
                            {
                                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
                            }
                            else
                            {
                                return new AddUpdateDelete() { Status = false, Message = AppMessage.Success, Data = TableName };
                            }
                        }
                        else
                        {
                            return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
                        }
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
                    }

                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = 0 };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = 0 };
            }
        }

        public async Task<AddUpdateDelete> GetUserCoinBalance(string UserId)
        {
            try
            {
                string query = $@"declare @UserId varchar(max) = '{UserId}';
                                        declare @currentDate varchar(100) = '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}';
                                        select 
											case when (
												(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = @UserId and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)) - SUM(led.DEBIT_COIN) - SUM(led.DEBIT_COIN)
											) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = @UserId and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)) - SUM(led.DEBIT_COIN) - SUM(led.DEBIT_COIN) <= 0
											then
												0
											else
												(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = @UserId and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)) - SUM(led.DEBIT_COIN)
											end as 'COIN_BALANCE'
										FROM LEDGER_MASTER_1957 led 
										join ORDER_MASTER_1969 ord on ord.ORDER_NO = led.ORDER_NO
										where ord.ORDER_TYPE = 'PACKAGE' and led.USER_ID = @UserId";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    if (string.IsNullOrEmpty(result[0]["COIN_BALANCE"].ToString()))
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = 0 };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = Convert.ToDouble(result[0]["COIN_BALANCE"]).ToString("n0") };
                    }

                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = 0 };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = 0 };
            }
        }

        public async Task<AddUpdateDelete> GetUserCoinBalance(string UserId, string CompanyCode, string CalendarCode)
        {
            try
            {
                string query = $@"select 
	                                case when (
		                                (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 f join ORDER_MASTER_1969 ord on ord.ORDER_NO = f.PAYMENT_ID where f.USER_ID = '{UserId}' and f.CALENDAR_CODE = '{CalendarCode}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and ord.ORDER_TYPE = 'PACKAGE') - SUM(led.DEBIT_COIN)
	                                ) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 f join ORDER_MASTER_1969 ord on ord.ORDER_NO = f.PAYMENT_ID where f.USER_ID = '{UserId}' and f.CALENDAR_CODE = '{CalendarCode}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and ord.ORDER_TYPE = 'PACKAGE') - SUM(led.DEBIT_COIN) <= 0
	                                then
		                                0
	                                else
		                                (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 f join ORDER_MASTER_1969 ord on ord.ORDER_NO = f.PAYMENT_ID where  f.USER_ID = '{UserId}' and f.CALENDAR_CODE = '{CalendarCode}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and ord.ORDER_TYPE = 'PACKAGE') - SUM(led.DEBIT_COIN)
	                                end as 'COIN_BALANCE'
                                FROM LEDGER_MASTER_1957 led 
                                join ORDER_MASTER_1969 ord on ord.ORDER_NO = led.ORDER_NO
                                where led.USER_ID = '{UserId}' and ord.ORDER_TYPE = 'PACKAGE'  and led.COMPANY_CODE = '{CompanyCode}' and led.CALENDAR_CODE = '{CalendarCode}'";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    if (string.IsNullOrEmpty(result[0]["COIN_BALANCE"]?.ToString()))
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = 0 };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result[0]["COIN_BALANCE"] };
                    }

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

        public async Task<AddUpdateDelete> GetCurrentPackageDetails(string UserId, string CompanyCode, string CalendarCode, string ServiceId, CommonTimeObject TimeRange)
        {
            try
            {
                var balance = await GetUserCoinBalance(UserId, CompanyCode, CalendarCode);
                var service = await sqlFunction.ExecuteSqlQuery("select fees_1, IS_SERVICE_PAID from SERVICE_MASTER_1933 where Id = " + ServiceId);
                var calendar = await sqlFunction.ExecuteSqlQuery($@"select * from BUSINESS_CALENDAR_MASTER_1925 where CALENDAR_CODE = '{CalendarCode}'");

                bool IsServicePaid = false;
                double ServiceFees = 0;
                if (service.Count()>0 && !string.IsNullOrEmpty(service[0]["IS_SERVICE_PAID"]?.ToString()))
                {
                    if (service[0]["IS_SERVICE_PAID"]?.ToString() ==  "Y")
                    {
                        if (!string.IsNullOrEmpty(service[0]["fees_1"]?.ToString()))
                        {
                            if (Convert.ToInt32(service[0]["fees_1"]) > 0)
                            {
                                IsServicePaid = true;

                                if (calendar.FirstOrDefault()["CALENDAR_CATEGORY_ID"]?.ToString() == "4" && calendar.FirstOrDefault()["CALENDAR_TYPE"]?.ToString() == "2")
                                {
                                    ServiceFees = Convert.ToDouble(service[0]["fees_1"]);

                                    if (TimeRange != null)
                                    {
                                        if (!string.IsNullOrEmpty(TimeRange.start) && !string.IsNullOrEmpty(TimeRange.end))
                                        {
                                            TimeSpan timeDifference = Convert.ToDateTime(TimeRange.end) - Convert.ToDateTime(TimeRange.start);
                                            double hoursDifference = timeDifference.TotalHours;

                                            ServiceFees = ServiceFees * hoursDifference;
                                        }
                                    }
                                }
                                else
                                {
                                    ServiceFees = Convert.ToInt32(service[0]["fees_1"]);
                                }
                            }
                            else
                            {
                                IsServicePaid = false;
                                ServiceFees = 0;
                            }
                        }
                        else
                        {
                            IsServicePaid = false;
                            ServiceFees = 0;
                        }
                    }
                    else
                    {
                        IsServicePaid = false;
                        ServiceFees = 0;
                    }
                }
                else
                {
                    IsServicePaid = false;
                    ServiceFees = 0;
                }

                if (IsServicePaid)
                {
                    if (balance.Data > 0)
                    {
                        if (Convert.ToInt32(balance.Data) < ServiceFees)
                        {
                            return new AddUpdateDelete() { Status = false, Message = $"You have {balance.Data} credits, not enough to book this slot.", Data = ServiceFees.ToString() };
                        }
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = $"You have {balance.Data} credits, not enough to book this slot.", Data = ServiceFees.ToString() };
                    }

                    return new AddUpdateDelete() { Status = true, Message = "" + ServiceFees.ToString() + " credits will be deducted from your " + calendar[0]["CALENDAR_NAME"].ToString() + " Calendar package.<br />(Balance after purchase " + (Convert.ToInt32(balance.Data) - ServiceFees).ToString() + " credits).", Data = ServiceFees.ToString() };
                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = "Are you sure to book this event?", Data = ServiceFees.ToString() };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
            }
        }

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetMyAttendanceList(GenerateDynamicFormData data, string userEmail)
        {
            try
            {
                Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "CALENDAR_NAME","calendarDets.CALENDAR_NAME"},
                    { "ACTIVITY_NAME","service_m.ACTIVITY_NAME"},
                    { "RESOURCE_DATA","service_p_m.FIRST_NAME + '' + service_p_m.LAST_NAME"},
                    { "LOCATION_CODE","location_m.LOCATION_CODE"},
                    { "FROM_TIME","calendar.[start]"},
                    { "TO_TIME","calendar.[end]"},
                    { "STUDENT_NAME","participant.STUDENT_NAME"},
                    { "ATTENDANCE","[ATTENDANCE]"},
                };

                string column = "", dir = "";
                if (data.sorters != null && data.sorters.Count() > 0)
                {
                    column = data.sorters.FirstOrDefault().field;
                    dir = data.sorters.FirstOrDefault().dir;
                }
                else
                {
                    column = "created_at";
                    dir = "desc";
                }



                List<string> applyFilter = new List<string>();

                if (data.filter != null)
                {
                    if (!string.IsNullOrEmpty(data.filter.value))
                        if (data.filter.type == "like")
                        {
                            applyFilter.Add("f.[" + data.filter.field + "]  " + data.filter.type + " '%" + data.filter.value + "%'");
                        }
                        else
                            applyFilter.Add("f.[" + data.filter.field + "] " + data.filter.type + " '" + data.filter.value + "'");
                }


                if (data.filters != null && data.filters.Count() > 0)
                {
                    foreach (var item in data.filters)
                    {
                        if (!string.IsNullOrEmpty(item.value))
                        {
                            if (item.field == "created_at" || item.field == "updated_at" || item.field == "FROM_TIME" || item.field == "TO_TIME")
                            {
                                item.field = (item.field == "FROM_TIME") ? "start" : (item.field == "TO_TIME") ? "end" : item.field;
                                string filter = await sqlFunction.GetDateFilter(item, "calendar");
                                applyFilter.Add(filter);
                            }
                            else
                            {
                                string filter = item.field + " like N'%" + item.value + "%'";
                                if (item.field == "RESOURCE_DATA")
                                {
                                    filter = "(service_p_m.FIRST_NAME like N'%" + item.value + "%' or service_p_m.LAST_NAME like N'%" + item.value + "%')";
                                }

                                applyFilter.Add(filter);
                            }
                        }

                    }
                }

                string applyFilterQuery = string.Join(" and ", applyFilter);
                applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

                int PageSize = data.size > 0 ? data.size : 20;
                int PageNumber = data.page > 0 ? data.page : 1;

                string strSql = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    select f.[Id]
                                          ,f.[created_at]
                                          ,f.[updated_at]
                                          ,f.[created_by]
                                          ,f.[updated_by]
                                          ,(select calendar.[start]+ ' to ' + calendar.[end]) as 'SLOT'
                                          ,calendar.[start] as 'FROM_TIME'
	                                      ,calendar.[end] as 'TO_TIME'                                          
                                          ,[RESOURCE]
                                          ,[ACTIVITY]
                                          ,[STUDENT]
                                          ,f.[REMARKS]
                                          ,[FEES]
                                          ,[FEES_1]
                                          ,[FEES_2]
                                          ,[FEES_LIST]
                                          ,[ATTENDANCE]
                                          ,[hidden_1683717028956]
                                          ,f.[COMPANY_CODE]
                                          ,f.[CALENDAR_CODE]
	                                      ,participant.STUDENT_NAME
	                                      ,calendarDets.CALENDAR_NAME
	                                      ,service_m.ACTIVITY_NAME
                                          ,location_m.LOCATION_CODE
	                                      ,service_p_m.FIRST_NAME + '' + service_p_m.LAST_NAME as 'RESOURCE_DATA'
										  ,company.COMPANY_NAME_ENGLISH
	                                      from [dbo].[TRANSACTION_MASTER_1942] f
                                    join CALENDAR_FORM_1935 calendar on calendar.Id = f.SLOT
									join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                    join PARTICIPANT_MASTER_1940 participant on participant.Id = f.STUDENT
                                    join BUSINESS_CALENDAR_MASTER_1925 calendarDets on calendarDets.CALENDAR_CODE = f.CALENDAR_CODE
                                    join SERVICE_MASTER_1933 service_m on service_m.Id = f.ACTIVITY
                                    join SERVICE_PROVIDER_MASTER_1934 service_p_m on service_p_m.Id = calendar.[resources]
                                    join LOCATION_MASTER_1936 location_m on location_m.Id = f.[RESOURCE]
                                    where participant.EMAIL = '{userEmail}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

                var listresult = await sqlFunction.ExecuteSqlQuery(strSql);
                if (listresult.Count() > 0)
                {
                    return new AddUpdateDelete<List<IDictionary<string, object>>>() { Status = true, Data = listresult };
                }

                return new AddUpdateDelete<List<IDictionary<string, object>>>() { Status = false };

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<List<IDictionary<string, object>>>() { Status = false, Message = ex.Message };
            }
        }



        public async Task<AddUpdateDelete> GetAllEnrolledCalendarsData(string CompanyCode, string UserEmail, string filterDate = null, bool IsCustomInFilter = false)
        {
            try
            {
                string CompanyCondition = "";

                if (!string.IsNullOrEmpty(CompanyCode) && CompanyCode != "0")
                {
                    if (!IsCustomInFilter)
                    {
                        CompanyCondition = " f.COMPANY_CODE='" + CompanyCode + "' and ";
                    }
                    else
                    {
                        CompanyCondition = " f.COMPANY_CODE in (" + CompanyCode + ") and ";
                    }
                }

                if (!string.IsNullOrEmpty(filterDate))
                {
                    CompanyCondition += "CAST(calendar.[start] AS DATE) = CAST('" + filterDate + "' AS DATE) and ";
                }

                string query = $@"
                                DECLARE @retval nvarchar(max);       DECLARE @sQuery nvarchar(max); DECLARE @ParmDefinition nvarchar(max);                        
                                DECLARE @customTitleQuery nvarchar(max);                          
                                IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END   ;with cte1 as( select distinct  f.*,f.resources 'resourceId'  ,  STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                                from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle
                                , (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,   (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                                where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) customForms  , (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) from form_calenderreferrence f2    
                                where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) customFormIds,  '' referrences_1,  '' referrences_2,  '' referrences_3, company.COMPANY_NAME_ENGLISH, calendar.CALENDAR_NAME
                                from CALENDAR_FORM_1935 f  
                                  join TRANSACTION_MASTER_1942 transaction_m on f.Id = transaction_m.SLOT
                                  join BUSINESS_CALENDAR_MASTER_1925 calendar on calendar.CALENDAR_CODE = f.CALENDAR_CODE
                                  join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                where   f.formid=2305 and {CompanyCondition}  participant.EMAIL = '{UserEmail}'  ) ,
                                cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1	 where len(customtitle)>0) 
                                select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= 1;   
                                select @counter = (select count(1) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                                SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';   
                                EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT;    update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end  select* from #temptable
                                ";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError };
            }
        }



        public async Task<AddUpdateDelete> GetAlreadyEnrolledEvents(string CompanyCode, string UserEmail, string FilterDate)
        {
            try
            {
                string query = $@"
                                DECLARE @retval nvarchar(max);       DECLARE @sQuery nvarchar(max); DECLARE @ParmDefinition nvarchar(max);                        
                                DECLARE @customTitleQuery nvarchar(max);                          
                                IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END   ;with cte1 as( select distinct  f.*,f.resources 'resourceId'  ,  STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                                from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle
                                , (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,   (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                                where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) customForms  , (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) from form_calenderreferrence f2    
                                where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) customFormIds,  '' referrences_1,  '' referrences_2,  '' referrences_3   
                                
                                from CALENDAR_FORM_1935 f  
                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                where
                                f.formid=2305 and
                                {FilterDate} ),
                                cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1	 where len(customtitle)>0) 
                                select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= 1;   
                                select @counter = (select count(1) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                                SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';
                                EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT;    update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end  select *, 'N' as 'IsAlreadyBooked', 'N' as 'ATTEND', '0' as 'TransactionId', 'N' as 'IsReviewable' from #temptable
                                ";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                query = $@"select transaction_m.* 
                        , 'Y' as 'IsAlreadyBooked'
                        , (select case when ((cast('{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' as datetime) >= cast((DATEADD(minute, -30, f.[start])) as datetime) and cast('{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' as datetime) <= cast(f.[end] as datetime) ) and transaction_m.ATTENDANCE not in ('PRESENT', 'ABSENT')) then 'Y' else 'N' end) as 'ATTEND'
                        , case when review.Id is not null then 'Y' else 'N' end as 'SESSION_REVIEWED'
                        from TRANSACTION_MASTER_1942 transaction_m 
                        join CALENDAR_FORM_1935 f on f.Id = transaction_m.SLOT
                        join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
                        left join SESSION_REVIEWS_1983 review on review.EVENT_ID = transaction_m.SLOT and review.USER_EMAIL = participant.EMAIL
                        where participant.EMAIL = '{UserEmail}' and transaction_m.COMPANY_CODE = '{CompanyCode}'";

                var alreadyEnrolledEvents = await sqlFunction.ExecuteSqlQuery(query);

                if (alreadyEnrolledEvents != null)
                {
                    if (alreadyEnrolledEvents.Count > 0)
                    {
                        if (result != null)
                        {
                            foreach (var item in result)
                            {
                                if (alreadyEnrolledEvents.Any(x => x["SLOT"]?.ToString() == item["Id"]?.ToString()))
                                {
                                    item["IsAlreadyBooked"] = 'Y';
                                    item["ATTEND"] = alreadyEnrolledEvents.FirstOrDefault(x => x["SLOT"]?.ToString() == item["Id"]?.ToString())["ATTEND"];
                                    item["TransactionId"] = alreadyEnrolledEvents.FirstOrDefault(x => x["SLOT"]?.ToString() == item["Id"]?.ToString())["Id"];
                                    //if (DateTimeUtility.Now() > Convert.ToDateTime(alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["end"]?.ToString()) && alreadyEnrolledEvents.FirstOrDefault(x => x["Id"]?.ToString() == item["Id"]?.ToString())["SESSION_REVIEWED"]?.ToString() == "N")
                                    if (DateTimeUtility.Now() > Convert.ToDateTime(item["start"]?.ToString()))
                                    {
                                        item["IsReviewable"] = 'Y';
                                    }
                                    else
                                    {
                                        item["IsReviewable"] = 'N';
                                    }
                                }
                                else
                                {
                                    item["IsAlreadyBooked"] = 'N';
                                    item["IsReviewable"] = 'N';
                                    item["ATTEND"] = 'N';
                                    item["TransactionId"] = '0';
                                }
                            }
                        }
                    }
                }

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
                                    ;with cte1 as( select distinct  f.*,f.resources 'resourceId', transaction_m.Id as 'TransactionId', company.COMPANY_LOGO_PATH, company.Id as 'COMPANY_ID', company.COMPANY_NAME_ENGLISH ,  STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                                    from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle
                                    , (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,   (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                                    where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) customForms  , (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) 
                                    from form_calenderreferrence f2    where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) customFormIds,  '' referrences_1,  '' referrences_2,  '' referrences_3 
                                    , (select case when (cast('{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' as datetime) >= cast((DATEADD(minute, -30, f.[start])) as datetime) and cast('{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' as datetime) <= cast(f.[end] as datetime) ) then 'Y' else 'N' end) as 'ATTEND'
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
        public async Task<AddUpdateDelete> GetMyUpcomingBookings(string UserEmail)
        {
            try
            {
                string query = $@"DECLARE @retval nvarchar(max);       DECLARE @sQuery nvarchar(max); DECLARE @ParmDefinition nvarchar(max);                        
                                    DECLARE @customTitleQuery nvarchar(max);           

                                    IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END 
                                    ;with cte1 as( select top 5 f.*,f.resources 'resourceId', transaction_m.Id as 'TransactionId', company.COMPANY_LOGO_PATH, company.Id as 'COMPANY_ID', company.COMPANY_NAME_ENGLISH ,  STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                                    from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle
                                    , (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,   (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                                    where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) customForms  , (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) 
                                    from form_calenderreferrence f2    where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) customFormIds,  '' referrences_1,  '' referrences_2,  '' referrences_3 
                                    , (select case when ((cast('{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' as datetime) >= cast((DATEADD(minute, -30, f.[start])) as datetime) and cast('{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' as datetime) <= cast(f.[end] as datetime) )  and transaction_m.ATTENDANCE not in ('PRESENT', 'ABSENT')) then 'Y' else 'N' end) as 'ATTEND'
                                    from CALENDAR_FORM_1935 f 
                                    join TRANSACTION_MASTER_1942 transaction_m on transaction_m.CALENDAR_CODE = f.CALENDAR_CODE
                                    join PARTICIPANT_MASTER_1940 participant_m on participant_m.Id = transaction_m.STUDENT
                                    join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                    where f.formid=2305 and participant_m.EMAIL = '{UserEmail}' and transaction_m.SLOT = f.Id and cast(f.[end] as datetime) > cast('{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' as datetime)
                                    order by cast(f.[start] as datetime)
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
