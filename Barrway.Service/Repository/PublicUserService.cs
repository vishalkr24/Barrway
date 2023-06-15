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


            // check if the user limit is crossed or not

            List <IDictionary<string, object>> totalUsersEnrolled = await sqlFunction.ExecuteSqlQuery($@"select COUNT(*) as 'COUNT' from TRANSACTION_MASTER_1942 transaction_m
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


        public async Task<AddUpdateDelete> BookingServiceEvent(RequestEventViewModel eventModal,string userName)
        {
            if (eventModal != null)
            {
                try
                {
                    var userResult = await authService.GetUser(userName, FormRole.PUBLIC_USER);
                    if (userResult.Status)
                    {
                        var userData = userResult.Data as IDictionary<string,object>;
                        string user_email = userData["USER_EMAIL"]?.ToString() ?? "";
                        List<IDictionary<string, object>> participantCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from PARTICIPANT_MASTER_1940 where EMAIL = '{user_email}' and COMPANY_CODE = '{eventModal.companyCode}' and CALENDAR_CODE = '{eventModal.calendarCode}'");


                        string StudentId = "";
                        if (participantCheckResult.Count > 0) {
                            StudentId = participantCheckResult.FirstOrDefault()["Id"].ToString();
                        }
                        else
                        {
                            var publicUser = await GetSinglePublicUserAccount(userName);
                            var publicUserData=publicUser.Data as IDictionary<string, object>;
                            IDictionary<string,object> participant=new Dictionary<string, object>();
                            participant["NICKNAME"] = publicUserData["NICK_NAME"]?.ToString()??"";
                            participant["EMAIL"] = user_email;
                            participant["CALENDAR_CODE"] = eventModal.calendarCode;
                            participant["COMPANY_CODE"] = eventModal.companyCode;
                            participant["ADDRESS"] = "";
                            participant["GENDER"] = publicUserData["GENDER"]?.ToString()??"";
                            participant["IS_ACTIVE"] = "Y";
                            participant["STUDENT_NAME"] = (publicUserData["FIRST_NAME"]?.ToString()??"" + " " + publicUserData["LAST_NAME"]?.ToString()??"").Trim();

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


                        Form_DataTable request = new Form_DataTable();

                        request.currentFormType = 1;
                        request.IsMaxOneRecordPerUser= false;
                        request.action = (int)FormAction.Save;
                        request.userId = (int)FormSetting.CreatedUser;
                        request.formId = (int)FormSetting.CALENDAR_FORM;
                        request.resourceFormId = eventModal.resourceFormId;
                        request.ActivityFormId = eventModal.activityFormId;
                        request.topicId = 1935;
                        request.created_by = (int)FormSetting.CreatedUser;
                        request.updated_by = (int)FormSetting.CreatedUser;
                        string formGroupKey = Guid.NewGuid().ToString();
                        request.formGroupKey = formGroupKey;
                        var start = Convert.ToDateTime(eventModal.start);
                        var end = Convert.ToDateTime(eventModal.start).AddMinutes(60);

                        var eventData = new {start = start, end = end, allDay = false, EVENT_TYPE = "BOOKING", description = "", resources = eventModal.resourceId, activities = eventModal.activityId, formGroupKey = formGroupKey, COMPANY_CODE=eventModal.companyCode, CALENDAR_CODE=eventModal.calendarCode }.ToDictionary();
                        eventData["resources_" + eventModal.resourceFormId] = eventModal.resourceId;
                        eventData["activities_" + eventModal.activityFormId] = eventModal.activityId;
                        eventData["activities_" + eventModal.otherActivityformId] = eventModal.otherActivityId;
                        eventData["activities_" + (int)FormSetting.PARTICIPANT_MASTER] = Convert.ToInt32(StudentId);

                        request.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(eventData);

                        GenerateDynamicFormData eventResponse = (await formAPIRepository.GeneratedFormData(request)).Data;
                        if (eventResponse.res == 1)
                        {

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
                               customForms=string.Join(",", customForms),
                               customFormIds=string.Join(",", customFormIds),
                               action=11,
                               formId=(int)FormSetting.CALENDAR_FORM,
                               formGroupKey=formGroupKey,
                               created_by=(int)FormSetting.CreatedUser,
                               updated_by=(int)FormSetting.CreatedUser
                            };
                            await formAPIRepository.ManageCalenderReferrenceNew(request2);

                            IDictionary<string, object> transaction = new Dictionary<string, object>();

                            transaction["SLOT"] = eventResponse.Id;
                            transaction["RESOURCE"] = eventModal.resourceId;
                            transaction["ACTIVITY"] = eventModal.activityId;
                            transaction["STUDENT"] = StudentId;
                            transaction["REMARKS"] = "";
                            transaction["FEES"] = "";
                            transaction["ATTENDANCE"] = "YES";
                            transaction["COMPANY_CODE"] = eventModal.companyCode;
                            transaction["CALENDAR_CODE"] = eventModal.calendarCode;



                            Form_DataTable transaction_req = new Form_DataTable();
                            transaction_req.action = (int)FormAction.Save;
                            transaction_req.formId = (int)FormSetting.TRANSACTION_MASTER;

                            transaction_req.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(transaction);
                            transaction_req.formGroupKey = Guid.NewGuid().ToString();
                            var formResult2 = (await formAPIRepository.GeneratedFormData(transaction_req)).Data;


                            IDictionary<string,string> upCommingBooking= new Dictionary<string, string>();

                            upCommingBooking["COMPANY_CODE"]= eventModal.companyCode.ToString();
                            upCommingBooking["CALENDAR_CODE"] = eventModal.calendarCode.ToString();
                            upCommingBooking["SLOT"] = eventResponse.Id.ToString();

                            upCommingBooking["ACTIVITY_NAME"] = eventModal.activityTitle;
                            upCommingBooking["RESOURCE_NAME"] = eventModal.resourceTitle;
                            upCommingBooking["STUDENT_NAME"] = userData["FIRST_NAME"]?.ToString()??"";

                            var upcommingBookingResult = await UpCommingBookingAdd(upCommingBooking);


                            return new AddUpdateDelete() { Status = true, Message = "Success" };
                        }
                        else
                        {
                            return new AddUpdateDelete() { Status = false, Message = eventResponse.Message };
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
        private async Task<int> UpCommingBookingAdd(IDictionary<string,string> data) {

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
                                                   ,'{data["COMPANY_CODE"]}'
                                                   ,'{data["CALENDAR_CODE"]}'
                                                   , (select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = {data["SLOT"]})                                                                                                                                                                                                     
                                                   , '{data["ACTIVITY_NAME"]}'
                                                   , '{data["RESOURCE_NAME"]}'
                                                   , '{data["STUDENT_NAME"]}'
                                                   , (select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = {data["SLOT"]}) 
                                                   , (select calendar.[end] from  CALENDAR_FORM_1935 calendar where Id = {data["SLOT"]}) )";


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
                                      FROM [dbo].[FAVORITE_CALENDAR_MASTER_1949] where USER_ID = '{userId}' and IS_PUBLIC_USER = 'Y' and CALENDAR_CODE = '{CalendarCode}' ";

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
                    CompanyLogic = " and COMPANY_CODE = '" + CompanyCode + "'";
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
                                      FROM [dbo].[FAVORITE_CALENDAR_MASTER_1949] where USER_ID = '{userId}' and IS_PUBLIC_USER = 'Y' {CompanyLogic} ";

                List<IDictionary<string, object>> result0 = await sqlFunction.ExecuteSqlQuery(query0);

                string calendarCodes = "";

                if (result0.Count > 0)
                {
                    for (int i = 0; i < result0.Count; i++)
                    {
                        if (i==result0.Count-1)
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

                string query = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
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
                                                  ,subCategory.CALENDAR_SUB_CATEGORY_NAME
                                              FROM [dbo].BUSINESS_CALENDAR_MASTER_1925 calendarDetails
                                              join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendarDetails.COMPANY_CODE
											  join BUSINESS_ACCOUNT_WEBSITE_1918 b_account on b_account.Id = company.BUSINESS_ACCOUNT_ID
								              join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendarDetails.CALENDAR_SUB_CATEGORY_ID
                                              where calendarDetails.CALENDAR_CODE in ({calendarCodes}) 
                                      )
                                  Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY created_at desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                string query2 = $@"SELECT distinct company.[COMPANY_CODE],company.[Id]
                                          ,[COMPANY_NAME_ENGLISH]
                                      FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                      join FAVORITE_CALENDAR_MASTER_1949 favorite on favorite.COMPANY_CODE = company.COMPANY_CODE
                                      where favorite.USER_ID = '{userId}'
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



        public async Task<AddUpdateDelete> GetAllEnrolledCalendarsData(string CompanyCode, string UserEmail,string filterDate = null, bool IsCustomInFilter=false)
        {
            try
            {
                string CompanyCondition = "";
                
                if (!string.IsNullOrEmpty(CompanyCode) && CompanyCode != "0")
                {
                    if (!IsCustomInFilter)
                    {
                        CompanyCondition = " calendar.COMPANY_CODE='" + CompanyCode + "' and ";
                    }
                    else
                    {
                        CompanyCondition = " calendar.COMPANY_CODE in (" + CompanyCode + ") and ";
                    }
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
                                    ;with cte1 as( select distinct  f.*,f.resources 'resourceId', company.COMPANY_LOGO_PATH, company.Id as 'COMPANY_ID', company.COMPANY_NAME_ENGLISH ,  STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
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
