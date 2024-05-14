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
using Newtonsoft.Json;
using System.Security.Cryptography;
using Barrway.DTO.MarketplaceModels;
using System.Runtime.InteropServices;

namespace Barrway.Service.Repository
{
    public class BusinessUserService : IBusinessUserService
    {
        private readonly string connectionString;
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly IMasterService masterService;

        public BusinessUserService(IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction, IMasterService masterService)
        {
            this.connectionString = ConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
            this.masterService = masterService;
        }

        public async Task<AddUpdateDelete> AddBusinessAssignedUser(BusinessAssignedUsersModel model)
        {
            Form_DataTable data = new Form_DataTable();
            data.action = (int)FormAction.Save;
            data.formId = (int)FormSetting.BUSINESS_ASSIGNED_USERS;

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

        public async Task<AddUpdateDelete> UpdateAdmin(string NewSuperUserId, string oldSuperUserId, string BusinessAccountId)
        {
            try
            {
                string sqlQuery = $@"update BUSINESS_ASSIGNED_USERS_1964 set ROLE_TYPE = 'SUPERUSER' where BUSINESS_ACCOUNT_ID = '{BusinessAccountId}' and ASSIGNED_USER = '{NewSuperUserId}'
                                     update BUSINESS_ASSIGNED_USERS_1964 set ROLE_TYPE = 'ADMIN' where BUSINESS_ACCOUNT_ID = '{BusinessAccountId}' and ASSIGNED_USER = '{oldSuperUserId}'";

                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlQuery);

                if (result > 0)
                {
                    return new AddUpdateDelete() { Status = true, Data = result, Message = AppMessage.Success };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Data = result, Message = AppMessage.SomeInternalError };
                }


            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> UpdateAssignedCompany(UserAssignedCompanyModel model, string UserId)
        {
            try
            {

                string sqlQuery = $@"declare @UserId varchar(50)
                                    set @UserId = (select ASSIGNED_USER from BUSINESS_ASSIGNED_USERS_1964 where Id = '{model.ASSIGN_ID}')
                                    update BUSINESS_ASSIGNED_USERS_1964 set ROLE_TYPE = 'ADMIN' where ASSIGNED_USER = '{UserId}' and COMPANY_ID = '{model.COMPANY_ID}' and ROLE_TYPE = 'SUPERUSER';
                                    update BUSINESS_ASSIGNED_USERS_1964 set ROLE_TYPE = 'SUPERUSER' where Id = '{model.ASSIGN_ID}';
                                    update USER_MASTER_1915 set COMPANY_CALENDAR_STATUS = 'Y', COMPANY_PROFILE_STATUS = 'Y', CURRENT_STEP = 'COMPLETED' where Id = @UserId";
                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlQuery);

                if (result > 0)
                {
                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true };
                }
                else
                {
                    return new AddUpdateDelete() { Message = AppMessage.SomeInternalError, Status = false };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message.ToString() };
            }
        }

        public async Task<AddUpdateDelete> DeleteAdmin(string Id)
        {
            try
            {
                string sqlQuery = $@"select user_m.Id as 'ACCOUNT_CREATOR', bau.ASSIGNED_USER  from 
                                        BUSINESS_ASSIGNED_USERS_1964 bau
                                        join BUSINESS_ACCOUNT_WEBSITE_1918 account on account.Id = bau.BUSINESS_ACCOUNT_ID
                                        join USER_MASTER_1915 user_m on user_m.USER_ID = account.USER_ID
                                        where bau.Id = '{Id}'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

                if (result.Count > 0)
                {
                    if (result[0]["ACCOUNT_CREATOR"]?.ToString() == result[0]["ASSIGNED_USER"]?.ToString())
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Cannot remove the creator of the business." };
                    }
                }

                sqlQuery = $@"delete from BUSINESS_ASSIGNED_USERS_1964 where Id = '{Id}'";

                var result2 = await sqlFunction.ExecuteSqlCommandQuery(sqlQuery);

                if (result2 > 0)
                {
                    return new AddUpdateDelete() { Status = true, Data = result, Message = AppMessage.Success };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Data = result, Message = AppMessage.SomeInternalError };
                }


            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> GetSingleBusinessWebsite(string UserId)
        {
            string query = "SELECT * FROM USER_MASTER_1915 where USER_ID = '" + UserId + "'";

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

        public async Task<AddUpdateDelete> GetAllAssignedBusinessList(string UserId)
        {
            string query = $@"select * from BUSINESS_ACCOUNT_WEBSITE_1918 f
                                join BUSINESS_ASSIGNED_USERS_1964 bau on bau.BUSINESS_ACCOUNT_ID = f.Id
                                where bau.ASSIGNED_USER = '{UserId}'";

            List<IDictionary<string, object>> BusinessResult = await sqlFunction.ExecuteSqlQuery(query);

            if (BusinessResult.Count > 0)
            {
                var businessCompany = BusinessResult.ToList();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = businessCompany };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetSuperAssignedBusinessList(string UserId)
        {
            string query = $@"select * from BUSINESS_ACCOUNT_WEBSITE_1918 f
                                join BUSINESS_ASSIGNED_USERS_1964 bau on bau.BUSINESS_ACCOUNT_ID = f.Id
                                where bau.ASSIGNED_USER = '{UserId}' and bau.ROLE_TYPE = 'SUPERUSER'";

            List<IDictionary<string, object>> BusinessResult = await sqlFunction.ExecuteSqlQuery(query);

            if (BusinessResult.Count > 0)
            {
                var businessCompany = BusinessResult.ToList();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = businessCompany };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> SendEmailInvite(BusinessUserInvitationModel inviteModel)
        {
            try
            {
                string sqlQuery = $@"with cte as (select Count(f.Id) as present 
                                        from BUSINESS_USER_INVITATION_MANAGER_1965 f
                                        where f.COMPANY_ID = '{inviteModel.COMPANY_ID}' and f.INVITED_EMAIL = '{inviteModel.INVITED_EMAIL}' and f.STATUS in ('OPENED', 'PENDING')
                                        Union
                                        select Count(f.Id) as present from BUSINESS_ASSIGNED_USERS_1964 f
                                        join USER_MASTER_1915 um on um.Id = f.ASSIGNED_USER
                                        where f.COMPANY_ID = '{inviteModel.COMPANY_ID}' and um.USER_EMAIL = '{inviteModel.INVITED_EMAIL}'
                                        )
                                        select * from cte";

                var checkResult = await sqlFunction.ExecuteSqlQuery(sqlQuery);

                if (checkResult.Count == 0)
                {
                    return new AddUpdateDelete() { Status = false, Message = "Invite not sent. Check Failed!" };
                }
                else
                {
                    if (Convert.ToInt32(checkResult[0]["present"]?.ToString()) > 0)
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Invite is already sent to this email. Check the status in Invitation History" };
                    }

                    if (checkResult.Count > 1)
                    {
                        if (Convert.ToInt32(checkResult[1]["present"]?.ToString()) > 0)
                        {
                            return new AddUpdateDelete() { Status = false, Message = "User with this email is already assigned to the business." };
                        }
                    }
                }

                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.BUSINESS_USER_INVITATION_MANAGER;

                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(inviteModel.ToDictionary());
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;


                StringBuilder strBody = new StringBuilder();
                strBody.Append($@"<body>
                                    <div class='container'>
                                        <div class='themes' style='background-color: #ffffff; width: 50%; margin:20px auto;'>
                                            <div style='height: 70px;line-height: 70px;background-color: #ffffff;padding:0 20px; border-radius: 8px 8px 0 0'>
                                                <h2 style='color: #3e6b6b;line-height: 70px;'>Barrway</h2>
                                            </div>
                                            <div class='content_body' style='padding:20px; text-align: left;'>
                                                <p>Dear User,</p>
                                                <p>Please click on the following link to view the invitation:</p>
                                                <p style='text-align: center;'><a target='_blank' href='{ConfigurationManager.AppSettings["baseurl"]?.ToString() + "/BusinessAdmin/ViewInvitation?Token=" + inviteModel.REQUEST_TOKEN}' target='_blank' style='height: 35px;line-height:35px; background-color:#3e6b6b;color:#ece9e0;padding:8px 10px;cursor:pointer; border:0px;font-size:15px;text-decoration: none;'>View Invitation</a></p>
                                            </div>
                                        </div>
                                    </div>
                                </body>");

                var result = EmailNotification.SendEmailAsync(inviteModel.INVITED_EMAIL, strBody.ToString(), "Barrway Invite");
                if (result)
                {
                    return new AddUpdateDelete() { Status = true, Message = "Invite sent successfully" };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Email not sent." };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message.ToString() };
            }
        }

        public async Task<AddUpdateDelete> ValidateInvitationTokenAndUser(string Token, string UserId)
        {
            string sqlQuery = $@"select um2.*, f.COMPANY_ID, f.STATUS, company.COMPANY_NAME_ENGLISH
                                    from BUSINESS_USER_INVITATION_MANAGER_1965 f
                                    join USER_MASTER_1915 um on um.USER_EMAIL = f.INVITED_EMAIL
                                    join USER_MASTER_1915 um2 on um2.Id = f.SENT_BY
									join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID
                                    where f.REQUEST_TOKEN = '{Token}' and um.Id = '{UserId}' and f.STATUS in ('PENDING','OPENED')";
            var validationResult = await sqlFunction.ExecuteSqlQuery(sqlQuery);
            if (validationResult.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = "Invitation Found", Data = validationResult.FirstOrDefault() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "Invitation Not Found" };
            }
        }

        public async Task<AddUpdateDelete> UpdateInvitationStatus(string Token, string Status, string UserId)
        {
            string query = $@"update USER_MASTER_1915 set COMPANY_PROFILE_STATUS = 'Y', COMPANY_CALENDAR_STATUS = 'Y', CURRENT_STEP = 'COMPLETED', PROFILE_STATUS = 'COMPLETED' where USER_ID = '{UserId}'";

            var updateResult = await sqlFunction.ExecuteSqlCommandQuery(query);

            string sqlQuery = $@"update BUSINESS_USER_INVITATION_MANAGER_1965 set STATUS = '{Status}'
                                 where REQUEST_TOKEN = '{Token}' and STATUS in ('Pending', 'OPENED')";
            var validationResult = await sqlFunction.ExecuteSqlCommandQuery(sqlQuery);
            if (validationResult > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = "Invitation Updated" };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "Invitation link expired" };
            }
        }

        public async Task<AddUpdateDelete> GetAllRecentInvites(GenerateDynamicFormData data, string UserId)
        {
            Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "COMPANY_CODE","company.COMPANY_CODE"},
                    { "COMPANY_NAME_ENGLISH","company.COMPANY_NAME_ENGLISH"},
                    { "COMPANY_NAME_CHINESE","company.COMPANY_NAME_CHINESE"},
                    { "COMPANY_PHONE","company.COMPANY_PHONE"},
                    { "COMPANY_CATEGORY_NAME","company.COMPANY_CATEGORY_NAME"},
                    { "CALENDAR_SUB_CATEGORY_NAME","company.CALENDAR_SUB_CATEGORY_NAME"},
                    { "created_at","company.created_at"},
                    { "updated_at","calendar.updated_at"},
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
            if (data.filters != null && data.filters.Count() > 0)
            {
                foreach (var item in data.filters)
                {
                    if (filters.Any(x => x.Key == item.field) && !string.IsNullOrEmpty(item.value))
                    {
                        if (item.field == "created_at" || item.field == "updated_at")
                        {
                            string filter = await sqlFunction.GetDateFilter(item, "company");
                            applyFilter.Add(filter);
                        }
                        else
                        {
                            string filter = filters[item.field] + " like N'%" + item.value + "%'";
                            applyFilter.Add(filter);
                        }

                    }
                }
            }

            string applyFilterQuery = string.Join(" and ", applyFilter);
            applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

            int PageSize = data.size > 0 ? data.size : 20;
            int PageNumber = data.page > 0 ? data.page : 1;

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    select baw.BUSINESS_CODE, um.USER_EMAIL, f.* 
                                    from BUSINESS_USER_INVITATION_MANAGER_1965 f
                                    join BUSINESS_ACCOUNT_WEBSITE_1918 baw on baw.Id = f.BUSINESS_ACCOUNT_ID
                                    join USER_MASTER_1915 um on um.Id = f.SENT_BY
                                    where f.SENT_BY = '{UserId}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")} 
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";
            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetSingleCompanyById(string Id)
        {
            string query = $@"SELECT company.[Id], company.TEMPLATE_ID, company.PALETTE_ID, city.CITY_NAME as 'COMPANY_CITY_NAME', district.DISTRICT_NAME as 'COMPANY_DISTRICT_NAME', country.COUNTRY_NAME as 'COMPANY_COUNTRY_NAME', company.[created_at]      ,company.[updated_at]      ,company.[created_by]      ,company.[updated_by],company.Latitude,company.Longitude,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE],     [COMPANY_EMAIL]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE],     [COMPANY_EMAIL]      ,company.[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID]      ,company.[COUNTRY_ID]      ,company.[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT],[IS_ACTIVE]  
                                FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                join DISTRICT_MASTER_1928 district on district.Id = company.DISTRICT_ID
                                join CITY_MASTER_1927 city on city.Id = company.CITY_ID
                                join COUNTRY_MASTER_1926 country on country.Id = company.COUNTRY_ID
                                where IS_ACTIVE = 'Y' and company.Id = '{Id}'";

            List<IDictionary<string, object>> BusinessCompanyResult = await sqlFunction.ExecuteSqlQuery(query);

            if (BusinessCompanyResult.Count > 0)
            {
                var businessCompany = BusinessCompanyResult.FirstOrDefault();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = businessCompany };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> getCompanyDashboardData(string CompanyCode, string UserId)
        {
            string query = $@"select COUNT(calendars.Id) as 'Calendars' from BUSINESS_CALENDAR_MASTER_1925 calendars where calendars.COMPANY_CODE = '{CompanyCode}'";

            string query2 = $@"select COUNT(service_m.Id) as 'Services' from SERVICE_MASTER_1933 service_m where COMPANY_CODE = '{CompanyCode}'";

            string query3 = $@"select COUNT(*) as 'BookingsToday' from TRANSACTION_MASTER_1942 where COMPANY_CODE = '{CompanyCode}' and (created_at < getDate() and created_at > DATEADD(d,0,DATEDIFF(d,0,GETDATE())))";

            string query4 = $@"select COUNT(*) as 'BookingsThisWeek' from TRANSACTION_MASTER_1942 where COMPANY_CODE = '{CompanyCode}' 
                                and (created_at >=  dateadd(day, 1-datepart(dw, getdate()), CONVERT(date,getdate())) 
                                and created_at < getdate())";

            string query5 = $@"select COUNT(serviceProvider_m.Id) as 'ServiceProviders' from SERVICE_PROVIDER_MASTER_1934 serviceProvider_m where COMPANY_CODE = '{CompanyCode}'";

            string query6 = $@" declare @Ids varchar(max)
                                set @Ids = (select stuff((select ',' + BUSINESS_ACCOUNT_ID from BUSINESS_ASSIGNED_USERS_1964 where ASSIGNED_USER = '{UserId}' and ROLE_TYPE = 'SUPERUSER' for xml path('')), 1, 1, ''));
                                
                                    select Count(account.BUSINESS_CODE) as 'Admins'
                                    from BUSINESS_ASSIGNED_USERS_1964 f
                                    join USER_MASTER_1915 user_m on user_m.Id = f.ASSIGNED_USER
                                    Join BUSINESS_ACCOUNT_WEBSITE_1918 account on account.Id = f.BUSINESS_ACCOUNT_ID
                                    where f.BUSINESS_ACCOUNT_ID in (select cast(item as integer) from dbo.SplitString(@Ids,','))";

            var SubscriptionData = await GetCompanyActiveSubscriptionDetails(CompanyCode, true);
            var SubsData2 = await GetSessionsForThisMonthCalendarWise(CompanyCode);

            List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);
            List<IDictionary<string, object>> result2 = await sqlFunction.ExecuteSqlQuery(query2);
            List<IDictionary<string, object>> result3 = await sqlFunction.ExecuteSqlQuery(query3);
            List<IDictionary<string, object>> result4 = await sqlFunction.ExecuteSqlQuery(query4);
            List<IDictionary<string, object>> result5 = await sqlFunction.ExecuteSqlQuery(query5);
            List<IDictionary<string, object>> result6 = await sqlFunction.ExecuteSqlQuery(query6);

            List<IDictionary<string, object>> finalList = new List<IDictionary<string, object>>();
            List<List<IDictionary<string, object>>> finalList2 = new List<List<IDictionary<string, object>>>();

            finalList.Add(result[0]);
            finalList.Add(result2[0]);
            finalList.Add(result3[0]);
            finalList.Add(result4[0]);
            finalList.Add(result5[0]);
            finalList.Add(result6[0]);
            finalList.Add(SubscriptionData.Data);

            finalList2.Add(finalList);
            finalList2.Add(SubsData2.Data);

            return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = finalList2 };
        }

        public async Task<AddUpdateDelete> getAllAssignedCompanies(string AssignedId, string UserId)
        {
            string query = $@"select bau.ROLE_TYPE, company.* from BUSINESS_COMPANY_MASTER_1924 company
                            join BUSINESS_ASSIGNED_USERS_1964 bau on bau.COMPANY_ID = company.Id
                            where bau.ASSIGNED_USER = {UserId}
                            ";
            List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

            return new AddUpdateDelete() { Status = true, Data = result, Message = AppMessage.Success };
        }

        public async Task<AddUpdateDelete> getCompanyCalendarDashboardData(string CompanyCode, string CalendarCode)
        {
            string query1 = $@"select COUNT(*) as 'BookingsToday' from TRANSACTION_MASTER_1942 where CALENDAR_CODE = '{CalendarCode}' and (created_at < getDate() and created_at > DATEADD(d,0,DATEDIFF(d,0,GETDATE())))";

            string query2 = $@"select COUNT(*) as 'BookingsThisWeek' from TRANSACTION_MASTER_1942 where CALENDAR_CODE = '{CalendarCode}' 
                                and (created_at >=  dateadd(day, 1-datepart(dw, getdate()), CONVERT(date,getdate())) 
                                and created_at < getdate())";

            List<IDictionary<string, object>> result1 = await sqlFunction.ExecuteSqlQuery(query1);
            List<IDictionary<string, object>> result2 = await sqlFunction.ExecuteSqlQuery(query2);

            List<IDictionary<string, object>> finalList = new List<IDictionary<string, object>>();

            finalList.Add(result1[0]);
            finalList.Add(result2[0]);

            return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = finalList };
        }

        public async Task<AddUpdateDelete> GetCompanyPhotoAlbumByCompanyId(string CompanyId, bool checkVisibility = false)
        {
            string visibilityQuery = "";
            if (checkVisibility)
            {
                visibilityQuery = " and IS_VISIBLE = 'Y'";
            }

            string query = $@"SELECT [Id]
                              ,[ALBUM_PHOTO_NAME]
                              ,[ALBUM_PHOTO_PATH]
                              ,[IS_VISIBLE]
	                          ,[COMPANY_ID]
                              ,[created_at]
                              ,[updated_at]
                              ,[created_by]
                              ,[updated_by]
                          FROM [dbo].[BUSINESS_PHOTO_ALBUM_1922] where COMPANY_ID = '{CompanyId}' {visibilityQuery} Order by Id desc";

            List<IDictionary<string, object>> Result = await sqlFunction.ExecuteSqlQuery(query);

            if (Result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = Result.ToList() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> AddCompanyPhotoAlbum(CompanyPhotoAlbumModel model)
        {
            Form_DataTable data = new Form_DataTable();
            data.action = (int)FormAction.Save;
            data.formId = (int)FormSetting.BUSINESS_PHOTO_ALBUM;

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

        public async Task<AddUpdateDelete> GetSingleCompanyPhotoAlbum(string Id)
        {
            string query = $@"select * from BUSINESS_PHOTO_ALBUM_1922 WHERE Id='{Id}'";

            List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> DeleteSingleCompanyPhotoAlbum(string Id)
        {
            string query = $@"delete from BUSINESS_PHOTO_ALBUM_1922 WHERE Id='{Id}'";

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

        public async Task<AddUpdateDelete> GetAllCompaniesByUserId(string UserId)
        {
            string query = $@"select bau.ROLE_TYPE, company.* from BUSINESS_COMPANY_MASTER_1924 company
                                join BUSINESS_ASSIGNED_USERS_1964 bau on bau.COMPANY_ID = company.Id
                                where bau.ASSIGNED_USER = '{UserId}'";

            List<IDictionary<string, object>> BusinessCompanyResult = await sqlFunction.ExecuteSqlQuery(query);

            if (BusinessCompanyResult.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = BusinessCompanyResult.ToList() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetAllCompaniesMasterByUserId(GenerateDynamicFormData data, string UserId)
        {
            Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "COMPANY_CODE","company.COMPANY_CODE"},
                    { "COMPANY_NAME_ENGLISH","company.COMPANY_NAME_ENGLISH"},
                    { "COMPANY_NAME_CHINESE","company.COMPANY_NAME_CHINESE"},
                    { "COMPANY_PHONE","company.COMPANY_PHONE"},
                    { "CALENDAR_CATEGORY_NAME","category.CALENDAR_CATEGORY_NAME"},
                    { "CALENDAR_SUB_CATEGORY_NAME","subCategory.CALENDAR_SUB_CATEGORY_NAME"},
                    { "created_at","company.created_at"},
                    { "updated_at","calendar.updated_at"},
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
            if (data.filters != null && data.filters.Count() > 0)
            {
                foreach (var item in data.filters)
                {
                    if (filters.Any(x => x.Key == item.field) && !string.IsNullOrEmpty(item.value))
                    {
                        if (item.field == "created_at" || item.field == "updated_at")
                        {
                            string filter = await sqlFunction.GetDateFilter(item, "company");
                            applyFilter.Add(filter);
                        }
                        else
                        {
                            string filter = filters[item.field] + " like N'%" + item.value + "%'";
                            applyFilter.Add(filter);
                        }

                    }
                }
            }

            string applyFilterQuery = string.Join(" and ", applyFilter);
            applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

            int PageSize = data.size > 0 ? data.size : 20;
            int PageNumber = data.page > 0 ? data.page : 1;

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    select bau.ROLE_TYPE, (case when (bau.ROLE_TYPE='SUPERUSER') then 'Y' else 'N' end) as 'IS_EDITABLE', company.* from BUSINESS_COMPANY_MASTER_1924 company
                                    join BUSINESS_ASSIGNED_USERS_1964 bau on bau.COMPANY_ID = company.Id
                                    where bau.ASSIGNED_USER = '{UserId}' and company.IS_ACTIVE = 'Y' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";
            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetAllBusinessAssignedUsers(GenerateDynamicFormData data, string CompanyId)
        {
            Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "BUSINESS_CODE","account.BUSINESS_CODE"},
                    { "USER_ID","user_m.USER_ID"},
                    { "USER_EMAIL","user_m.USER_EMAIL"},
                    { "ROLE_TYPE","f.ROLE_TYPE"},
                    { "created_at","f.created_at"},
            };

            string column = "", dir = "";
            if (data.sorters != null && data.sorters.Count() > 0)
            {
                column = data.sorters.FirstOrDefault().field;
                dir = data.sorters.FirstOrDefault().dir;
            }
            else
            {
                column = "ROLE_TYPE";
                dir = "desc";
            }

            List<string> applyFilter = new List<string>();
            if (data.filters != null && data.filters.Count() > 0)
            {
                foreach (var item in data.filters)
                {
                    if (filters.Any(x => x.Key == item.field) && !string.IsNullOrEmpty(item.value))
                    {
                        if (item.field == "created_at" || item.field == "updated_at")
                        {
                            string filter = await sqlFunction.GetDateFilter(item, "f");
                            applyFilter.Add(filter);
                        }
                        else
                        {
                            string filter = filters[item.field] + " like N'%" + item.value + "%'";
                            applyFilter.Add(filter);
                        }

                    }
                }
            }

            string applyFilterQuery = string.Join(" and ", applyFilter);
            applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

            int PageSize = data.size > 0 ? data.size : 20;
            int PageNumber = data.page > 0 ? data.page : 1;

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; 
                                
                                with formdata as (
                                    select user_m.USER_EMAIL, user_m.USER_ID, account.NICK_NAME, company.COMPANY_NAME_ENGLISH, f.* 
                                    from BUSINESS_ASSIGNED_USERS_1964 f
                                    join USER_MASTER_1915 user_m on user_m.Id = f.ASSIGNED_USER
									join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID
                                    Join PUBLIC_USER_ACCOUNT_1943 account on account.USER_ID = user_m.USER_ID
                                    where f.COMPANY_ID =  '{CompanyId}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
                                )
                                Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";
            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetSingleBusinessUserMaster(GenerateDynamicFormData data, string UserId)
        {
            Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "USER_ID","user_m.USER_ID"},
                    { "USER_EMAIL","user_m.USER_EMAIL"},
                    { "USER_PHONE","user_m.USER_PHONE"},
                    { "ROLE_NAME","role_m.SUB_ROLE"},
                    { "created_at","user.created_at"},
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
            if (data.filters != null && data.filters.Count() > 0)
            {
                foreach (var item in data.filters)
                {
                    if (filters.Any(x => x.Key == item.field) && !string.IsNullOrEmpty(item.value))
                    {
                        if (item.field == "created_at" || item.field == "updated_at")
                        {
                            string filter = await sqlFunction.GetDateFilter(item, "user_m");
                            applyFilter.Add(filter);
                        }
                        else
                        {
                            string filter = filters[item.field] + " like N'%" + item.value + "%'";
                            applyFilter.Add(filter);
                        }

                    }
                }
            }

            string applyFilterQuery = string.Join(" and ", applyFilter);
            applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

            int PageSize = data.size > 0 ? data.size : 20;
            int PageNumber = data.page > 0 ? data.page : 1;

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    SELECT user_m.[Id]
                                          ,user_m.[USER_ID]
                                          ,[USER_EMAIL]
                                          ,[USER_PHONE]
                                          ,user_m.[SUB_ROLE]
                                          ,user_m.[created_at]
                                          ,[IS_ACTIVE]
                                      FROM [dbo].[USER_MASTER_1915] user_m
                                      join ROLE_MASTER_1917 role_m on role_m.Id = user_m.ROLE_ID 
                                      join BUSINESS_ACCOUNT_WEBSITE_1918 business on business.USER_ID = user_m.USER_ID
                                      where user_m.ROLE_ID = 1 and business.Id = (select Id from BUSINESS_ACCOUNT_WEBSITE_1918 where USER_ID = '{UserId}') {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetAllCalendarTemplatesByCategory(string CalendarCategoryId)
        {
            string query = $@"select distinct calendar.*, (select count(*) from LOCATION_MASTER_1936 where CALENDAR_CODE = calendar.CALENDAR_CODE) 'TOTAL_LOCATIONS',
(select count(*) from SERVICE_MASTER_1933 where CALENDAR_CODE = calendar.CALENDAR_CODE) 'TOTAL_SERVICES', (select count(*) from SERVICE_PROVIDER_MASTER_1934 where CALENDAR_CODE = calendar.CALENDAR_CODE) 'TOTAL_SERVICE_PROVIDERS',
(select count(*) from SCHEDULAR_FORM_1941 where CALENDAR_CODE = calendar.CALENDAR_CODE) 'TOTAL_SCHEDULARS', 
(STUFF((SELECT ',' + CONVERT(NVARCHAR(MAX), d.[CALENDAR_SUB_CATEGORY_NAME]) FROM CALENDAR_SUB_CATEGORY_MASTER_1930 AS d INNER JOIN BUSINESS_CALENDAR_MASTER_1925 AS ei ON ',' + CONVERT(VARCHAR(12), ei.[CALENDAR_SUB_CATEGORY_ID]) + ',' LIKE '%,' + CONVERT(VARCHAR(12), d.[Id]) + ',%' WHERE ei.[Id] = calendar.[Id] ORDER BY d.[CALENDAR_SUB_CATEGORY_NAME] FOR XML PATH('')), 1, 1, N'')) as CALENDAR_SUB_CATEGORY_NAME

from BUSINESS_CALENDAR_MASTER_1925 calendar 
                                join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
                                left join  CALENDAR_SUB_CATEGORY_MASTER_1930  subCategory on EXISTS(SELECT * FROM split_string(calendar.[CALENDAR_SUB_CATEGORY_ID] , ',') where tuple=subCategory.[Id]) 
                                where company.IS_TEMPLATE = 'Y' and calendar.CALENDAR_CATEGORY_ID = {CalendarCategoryId}";

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

        public async Task<AddUpdateDelete> getSingleTemplate(string TemplateId)
        {
            string query = $@"select calendar.* from BUSINESS_CALENDAR_MASTER_1925 calendar 
                            join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
                            where company.IS_TEMPLATE = 'Y' and calendar.Id = {TemplateId}";

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

        public async Task<AddUpdateDelete> GetSingleCalendarById(string Id)
        {
            string query = "SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[CALENDAR_CATEGORY_ID]      ,[CALENDAR_SUB_CATEGORY_ID]      ,[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] where Id =  '" + Id + "'";

            List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                var calendar = result.FirstOrDefault();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = calendar };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> UpdateCalendarType(string CalendarCode, string CalendarType)
        {
            try
            {
                string sqlQuery = $@"select * from BUSINESS_CALENDAR_MASTER_1925 where CALENDAR_CODE = '{CalendarCode}'";
                var checkResult = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                string additionalUpdate = $@"";

                if (checkResult.FirstOrDefault()["CALENDAR_CATEGORY_ID"]?.ToString() == "2" && CalendarType == "4")
                {
                    additionalUpdate = " CALENDAR_FUNCTION_TYPE = 'QUEUE',";
                }
                else if (checkResult.FirstOrDefault()["CALENDAR_CATEGORY_ID"]?.ToString() == "3" && CalendarType == "3")
                {
                    additionalUpdate = " CALENDAR_FUNCTION_TYPE = 'QUEUE',";
                }
                else if (checkResult.FirstOrDefault()["CALENDAR_CATEGORY_ID"]?.ToString() == "6")
                {
                    additionalUpdate = " CALENDAR_FUNCTION_TYPE = 'QUEUE',";
                }
                else
                {
                    additionalUpdate = " CALENDAR_FUNCTION_TYPE = 'CALENDAR',";
                }

                if (checkResult.FirstOrDefault()["CALENDAR_CATEGORY_ID"]?.ToString() == "1" && CalendarType == "1")
                {
                    additionalUpdate += " SERVICE_CHARGE_BY = 'COURSE',";
                }
                else
                {
                    additionalUpdate += " SERVICE_CHARGE_BY = 'CLASS',";
                }

                string query = $@"update BUSINESS_CALENDAR_MASTER_1925 set {additionalUpdate} CALENDAR_TYPE = '{CalendarType}' where CALENDAR_CODE = '{CalendarCode}'";
                var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (result > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Kindly Refresh and Try Again!" };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> PublishCalendar(string CalendarCode, string UserId)
        {
            try
            {
                string query = $@"declare @id varchar(max) = (select cal.Id from BUSINESS_CALENDAR_MASTER_1925 cal
                                    join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = cal.COMPANY_CODE
                                    join BUSINESS_ASSIGNED_USERS_1964 bau on bau.COMPANY_ID = company.Id
                                    where cal.CALENDAR_CODE = '{CalendarCode}' and bau.ASSIGNED_USER = '{UserId}')

                                    update BUSINESS_CALENDAR_MASTER_1925 set STATUS = 'PUBLISH' where Id = @id";
                var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (result > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = "Calendar is now published." };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Transaction Not Allowed." };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> UpdateStaffServiceMapping(List<StaffServiceMappingModel> model)
        {
            try
            {
                string query = $@"delete from STAFF_SERVICE_MAPPING_1971 where CALENDAR_CODE = '{model.FirstOrDefault().CALENDAR_CODE}'";
                var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                List<string> requestList = new List<string>();
                List<string> formGroupKeyListTemp = new List<string>();

                var dataSerialized = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(JsonConvert.SerializeObject(model));

                dataSerialized.ForEach(assign =>
                {
                    Dictionary<string, object> sd = new Dictionary<string, object>();
                    foreach (KeyValuePair<string, string> keyValuePair in assign)
                    {
                        if (keyValuePair.Key != "Id")
                        {
                            sd.Add(keyValuePair.Key, keyValuePair.Value.ToString());
                        }

                    }

                    requestList.Add(CustomMethods.ConvertDicToNameValuePair(sd));
                    formGroupKeyListTemp.Add(Guid.NewGuid().ToString());
                });

                Form_DataTable request = new Form_DataTable();
                request.action = (int)FormAction.Save;
                request.formId = (int)FormSetting.STAFF_SERVICE_MAPPING;
                request.IsMaxOneRecordPerUser = false;
                request.formfieldDataListTempList = requestList.ToArray();
                request.formGroupKeyListTemp = formGroupKeyListTemp.ToArray();
                var formResult = (await formAPIRepository.BulkGeneratedFormData(request)).Data;

                if (formResult.res == 1)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Kindly Refresh and Try Again!" };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> GetStaffServiceMappingData(string CalendarCode)
        {
            try
            {
                string query = $@"select * from STAFF_SERVICE_MAPPING_1971 where CALENDAR_CODE = '{CalendarCode}'";
                var result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Kindly Refresh and Try Again!" };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> GetCompanyCalendarByCompanyId(string CompanyId)
        {
            string query = $@"SELECT calendar.[Id], calendar.ADDITIONAL_FORM_ID, calendar.NEED_ADDITIONAL_FORM, calendar.STATUS, calendar.[CALENDAR_FUNCTION_TYPE], calendar.[CALENDAR_TYPE], calendar.[created_at], company.IS_ACTIVE      ,calendar.[updated_at]      ,calendar.[created_by]      ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,[CALENDAR_CATEGORY_ID]      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                where company.IS_ACTIVE = 'Y' and company.Id = '{CompanyId}'";

            List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.ToList() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetMarcketPlaceCompanyCalendarByCompanyId(string CompanyId)
        {
            string query = $@"SELECT calendar.[Id], calendar.CALENDAR_FUNCTION_TYPE, calendar.STATUS, calendar.[created_at], company.IS_ACTIVE      ,calendar.[updated_at]      ,calendar.[created_by]      ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,calendar.[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,[CALENDAR_CATEGORY_ID]      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                join CALENDAR_COMMON_CATEGORY_1978 category on category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
                                where company.IS_ACTIVE = 'Y' and company.Id = '{CompanyId}' and calendar.CALENDAR_USE_TYPE = 'PUBLIC' and calendar.STATUS = 'PUBLISH'";

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

        public async Task<AddUpdateDelete> GetAllSubscriptionPlansForBusiness()
        {
            var disc = Convert.ToDecimal(ConfigurationManager.AppSettings["BUS_YEAR_DISC"]);
            string query = $@"SELECT [Id]
                                ,[formGroupKey]
                                ,[PLAN_NAME]
                                ,[PLAN_DESC]
                                ,[PLAN_PRICE]   
                                ,[PLAN_PRICE]*12- ((PLAN_PRICE*12*{disc})/100) [YEARA_PRICE]
                                ,(case when NUM_OF_AVAIL_CLR=-1 then 'Unlimited' else cast(NUM_OF_AVAIL_CLR as varchar(50)) end) NUM_OF_AVAIL_CLR
								,(case when VALID_SESSIONS=-1 then 'Unlimited' else cast(VALID_SESSIONS as varchar(50)) end) VALID_SESSIONS
                                ,isnull(COMPANY_ADMIN,'N/A') as COMPANY_ADMIN ,Isnull(COMPANY_WEBSITE,'N/A') as COMPANY_WEBSITE,isnull(PAYMENT_GATEWAY,'N/A') as PAYMENT_GATEWAY ,[PAYMENT_TRAN_FEE]
                                ,[PLAN_STATUS]
                                ,[created_at]
                                ,[IS_FREE_PLAN]
								,(case when VALID_BOOKING_SESSION=-1 then 'Unlimited' else cast(VALID_BOOKING_SESSION as varchar(50)) end) VALID_BOOKING_SESSION
                              FROM [dbo].[BUSINESS_PLAN_MASTER_1966] where PLAN_STATUS = 'ACTIVE'";

            List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                result.ForEach(x =>
                {
                    x["PLAN_PRICE"] = Convert.ToDecimal(x["PLAN_PRICE"]?.ToString()).ToString("N0");
                    x["YEARA_PRICE"] = Convert.ToDecimal(x["YEARA_PRICE"]?.ToString()).ToString("N0");
                });
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetCompanyCalendars(GenerateDynamicFormData data, string CompanyId)
        {
            Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "COMPANY_CODE","company.COMPANY_CODE"},
                    { "COMPANY_NAME_ENGLISH","company.COMPANY_NAME"},
                    { "CALENDAR_NAME","calendar.CALENDAR_NAME_ENGLISH"},
                    { "CALENDAR_CATEGORY_NAME","category.CMN_CATEGORY_NAME"},
                    { "created_at","calendar.created_at"},
                    { "updated_at","calendar.updated_at"},
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
            if (data.filters != null && data.filters.Count() > 0)
            {
                foreach (var item in data.filters)
                {
                    if (filters.Any(x => x.Key == item.field) && !string.IsNullOrEmpty(item.value))
                    {
                        if (item.field == "created_at" || item.field == "updated_at")
                        {
                            string filter = await sqlFunction.GetDateFilter(item, "calendar");
                            applyFilter.Add(filter);
                        }
                        else
                        {
                            string filter = filters[item.field] + " like N'%" + item.value + "%'";
                            applyFilter.Add(filter);
                        }

                    }
                }
            }

            string applyFilterQuery = string.Join(" and ", applyFilter);
            applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

            int PageSize = data.size > 0 ? data.size : 20;
            int PageNumber = data.page > 0 ? data.page : 1;

            //   string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
            //                           SELECT calendar.[Id], company.IS_ACTIVE      ,calendar.[created_at]      ,calendar.[updated_at]      ,calendar.[created_by], company.[COMPANY_NAME_ENGLISH] , company.Id as 'COMPANY_ID'     ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,calendar.[CALENDAR_CATEGORY_ID], category.CMN_CATEGORY_NAME as 'CALENDAR_CATEGORY_NAME', subCategory.CALENDAR_SUB_CATEGORY_NAME      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
            //                           join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
            //                           join CALENDAR_COMMON_CATEGORY_1978 category on category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
            //join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendar.CALENDAR_SUB_CATEGORY_ID
            //where company.IS_ACTIVE = 'Y' and company.Id = '{CompanyId}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
            //                           )
            //                           Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";


            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    SELECT distinct calendar.[Id], company.IS_ACTIVE      ,calendar.[created_at]      ,calendar.[updated_at]      ,
                                    calendar.[created_by], company.[COMPANY_NAME_ENGLISH] , company.Id as 'COMPANY_ID'     ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,
                                    [CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,calendar.[CALENDAR_CATEGORY_ID], 
                                    category.CMN_CATEGORY_NAME as 'CALENDAR_CATEGORY_NAME', 
                                    (STUFF((SELECT ',' + CONVERT(NVARCHAR(MAX), d.[CALENDAR_SUB_CATEGORY_NAME]) FROM CALENDAR_SUB_CATEGORY_MASTER_1930 AS d INNER JOIN BUSINESS_CALENDAR_MASTER_1925 AS ei ON ',' + CONVERT(VARCHAR(12), ei.[CALENDAR_SUB_CATEGORY_ID]) + ',' LIKE '%,' + CONVERT(VARCHAR(12), d.[Id]) + ',%' WHERE ei.[Id] = calendar.[Id] ORDER BY d.[CALENDAR_SUB_CATEGORY_NAME] FOR XML PATH('')), 1, 1, N'')) as CALENDAR_SUB_CATEGORY_NAME
                                    ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  
                                    FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                    join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                    join CALENDAR_COMMON_CATEGORY_1978 category on category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
									left join  CALENDAR_SUB_CATEGORY_MASTER_1930  subCategory on EXISTS(SELECT * FROM split_string(calendar.[CALENDAR_SUB_CATEGORY_ID] , ',') where tuple=subCategory.[Id]) 
									where company.IS_ACTIVE = 'Y' and company.Id = '{CompanyId}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";




            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetCompanyCalendarTemplates(GenerateDynamicFormData data, string CompanyCode)
        {
            Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "COMPANY_CODE","company.COMPANY_CODE"},
                    { "COMPANY_NAME_ENGLISH","company.COMPANY_NAME"},
                    { "CALENDAR_NAME","calendar.CALENDAR_NAME_ENGLISH"},
                    { "CALENDAR_CATEGORY_NAME","category.CALENDAR_CATEGORY_NAME"},
                    { "created_at","calendar.created_at"},
                    { "updated_at","calendar.updated_at"},
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
            if (data.filters != null && data.filters.Count() > 0)
            {
                foreach (var item in data.filters)
                {
                    if (filters.Any(x => x.Key == item.field) && !string.IsNullOrEmpty(item.value))
                    {
                        if (item.field == "created_at" || item.field == "updated_at")
                        {
                            string filter = await sqlFunction.GetDateFilter(item, "calendar");
                            applyFilter.Add(filter);
                        }
                        else
                        {
                            string filter = filters[item.field] + " like N'%" + item.value + "%'";
                            applyFilter.Add(filter);
                        }

                    }
                }
            }

            string applyFilterQuery = string.Join(" and ", applyFilter);
            applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

            int PageSize = data.size > 0 ? data.size : 20;
            int PageNumber = data.page > 0 ? data.page : 1;

            //   string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
            //                           SELECT calendar.[Id], company.IS_ACTIVE      ,calendar.[created_at]      ,calendar.[updated_at]      ,calendar.[created_by], company.[COMPANY_NAME_ENGLISH] , company.Id as 'COMPANY_ID'     ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,calendar.[CALENDAR_CATEGORY_ID], category.CMN_CATEGORY_NAME as 'CALENDAR_CATEGORY_NAME', subCategory.CALENDAR_SUB_CATEGORY_NAME      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
            //                           join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
            //                           join CALENDAR_COMMON_CATEGORY_1978 category on category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
            //join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendar.CALENDAR_SUB_CATEGORY_ID
            //where company.IS_ACTIVE = 'Y' and company.Id = '{CompanyCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
            //                           )
            //                           Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                       SELECT distinct calendar.[Id], company.IS_ACTIVE      ,calendar.[created_at]      ,calendar.[updated_at]      ,calendar.[created_by], company.[COMPANY_NAME_ENGLISH] , company.Id as 'COMPANY_ID'   
,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]  
,calendar.[CALENDAR_CATEGORY_ID], category.CMN_CATEGORY_NAME as 'CALENDAR_CATEGORY_NAME', 
(STUFF((SELECT ',' + CONVERT(NVARCHAR(MAX), d.[CALENDAR_SUB_CATEGORY_NAME]) FROM CALENDAR_SUB_CATEGORY_MASTER_1930 AS d INNER JOIN BUSINESS_CALENDAR_MASTER_1925 AS ei ON ',' + CONVERT(VARCHAR(12), ei.[CALENDAR_SUB_CATEGORY_ID]) + ',' LIKE '%,' + CONVERT(VARCHAR(12), d.[Id]) + ',%' WHERE ei.[Id] = calendar.[Id] ORDER BY d.[CALENDAR_SUB_CATEGORY_NAME] FOR XML PATH('')), 1, 1, N'')) as CALENDAR_SUB_CATEGORY_NAME
,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  
FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                       join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                       join CALENDAR_COMMON_CATEGORY_1978 category on category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
            left join  CALENDAR_SUB_CATEGORY_MASTER_1930  subCategory on EXISTS(SELECT * FROM split_string(calendar.[CALENDAR_SUB_CATEGORY_ID] , ',') where tuple=subCategory.[Id]) 
            where company.IS_ACTIVE = 'Y' and company.Id = '{CompanyCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
                                       )
                                       Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";








            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }
        public async Task<AddUpdateDelete> GetCalendarUpcomingBookings(GenerateDynamicFormData data, string CompanyCode, string CalendarCode)
        {
            Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "BOOKING_DATE","BOOKING_DATE"},
                    { "SERVICE_NAME","SERVICE_NAME"},
                    { "SERVICE_PROVIDER","SERVICE_PROVIDER"},
                    { "LOCATION_NAME","LOCATION_NAME"},
                    { "CLIENT_NAME","CLIENT_NAME"},
                    { "FROM_TIME","FROM_TIME"},
                    { "TO_TIME","TO_TIME"},
            };

            string column = "", dir = "";
            if (data.sorters != null && data.sorters.Count() > 0)
            {
                column = data.sorters.FirstOrDefault().field;
                dir = data.sorters.FirstOrDefault().dir;
            }
            else
            {
                column = "cast(BOOKING_DATE as datetime)";
                dir = "asc";
            }

            List<string> applyFilter = new List<string>();
            if (data.filters != null && data.filters.Count() > 0)
            {
                foreach (var item in data.filters)
                {
                    if (filters.Any(x => x.Key == item.field) && !string.IsNullOrEmpty(item.value))
                    {
                        if (item.field == "created_at" || item.field == "updated_at")
                        {
                            string filter = await sqlFunction.GetDateFilter(item, "booking");
                            applyFilter.Add(filter);
                        }
                        else
                        {
                            string filter = filters[item.field] + " like N'%" + item.value + "%'";
                            applyFilter.Add(filter);
                        }

                    }
                }
            }

            applyFilter.Add($"cast(FROM_TIME as datetime) >= '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'");

            string applyFilterQuery = string.Join(" and ", applyFilter);
            applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

            int PageSize = data.size > 0 ? data.size : 20;
            int PageNumber = data.page > 0 ? data.page : 1;

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    
                                         SELECT booking.[Id]
                                          ,booking.[created_at]
                                          ,booking.[updated_at]
                                          ,booking.[created_by]
                                          ,booking.[updated_by]
                                          ,booking.[COMPANY_CODE]
                                          ,booking.[CALENDAR_CODE]
										  , (select SERVICE_NAME from SERVICE_MASTER_1933 where Id = (select t_ref.referrenceId from form_calenderreferrence t_ref where formgroupKey = cf.formGroupKey and t_ref.referrenceFormId = '2303')) as 'SERVICE_NAME'
										  , (select FIRST_NAME from SERVICE_PROVIDER_MASTER_1934 where Id = (select t_ref.referrenceId from form_calenderreferrence t_ref where formgroupKey = cf.formGroupKey and t_ref.referrenceFormId = '2304')) as 'SERVICE_PROVIDER'
										  , (select LOCATION_ADDRESS from LOCATION_MASTER_1936 where Id = (select t_ref.referrenceId from form_calenderreferrence t_ref where formgroupKey = cf.formGroupKey and t_ref.referrenceFormId = '2306')) as 'LOCATION_NAME'
                                          ,[BOOKING_DATE]
                                          ,(select p.STUDENT_NAME from PARTICIPANT_MASTER_1940 p where p.Id = cast(booking.CLIENT_NAME as int)) as CLIENT_NAME
                                          ,[FROM_TIME]
                                          ,[TO_TIME]
                                          ,[EVENT_ID]
                                      FROM [dbo].[COMPANY_UPCOMING_BOOKINGS_1945] booking 
									  join CALENDAR_FORM_1935 cf on cf.Id = booking.EVENT_ID
									  where booking.COMPANY_CODE = 'CMP00079' and booking.CALENDAR_CODE = 'CLR00101'
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata {(!string.IsNullOrEmpty(applyFilterQuery) ? " where " + applyFilterQuery : "")} ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";
            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetSchedule(string ScheduleId, string UserId)
        {
            string sqlQuery = $@"SELECT schedular.*
                                  FROM [dbo].[SCHEDULAR_FORM_1941] schedular
								  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = schedular.COMPANY_CODE
								  join BUSINESS_ASSIGNED_USERS_1964 bau on bau.COMPANY_ID = company.Id
								  join USER_MASTER_1915 um on um.Id = bau.ASSIGNED_USER
                                  where schedular.Id = '{ScheduleId}' and um.USER_ID = '{UserId}'";

            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetSchedule(string CompanyCode, string CalendarCode, string UserId)
        {
            string sqlQuery = $@"SELECT top 1  schedular.*
                                  FROM [dbo].[SCHEDULAR_FORM_1941] schedular
								  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = schedular.COMPANY_CODE
								  join BUSINESS_ASSIGNED_USERS_1964 bau on bau.COMPANY_ID = company.Id
								  join USER_MASTER_1915 um on um.Id = bau.ASSIGNED_USER
                                  where schedular.COMPANY_CODE = '{CompanyCode}' and schedular.CALENDAR_CODE = '{CalendarCode}' and um.USER_ID = '{UserId}' order by created_at desc";

            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                var queueData = await GetQueueAndSession(CompanyCode, CalendarCode);

                result.FirstOrDefault()["SCH_SCHEDULE_TABLE"] = JsonConvert.SerializeObject(queueData.Data);

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetCourseEvents(string ServiceId, string UserEmail)
        {
            string sqlQuery = $@"select 
                                    case when (t.Id is not null and p.Id is not null) then 'Y' else 'N' end as 'IsBooked'
                                    , (select case when ((cast('{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' as datetime) >= cast((DATEADD(minute, -30, f.[start])) as datetime) and cast('{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' as datetime) <= cast(f.[end] as datetime) ) and t.ATTENDANCE != 'PRESENT' and (t.Id is not null and p.Id is not null)) then 'Y' else 'N' end) as 'ATTEND'
                                    ,(select case when (f.[start] < '{DateTimeUtility.Now().ToString("yyyy-MM-dd")}') then 'Y' else 'N' end) as 'IsPreviousSession'                              
                                    ,f.* from CALENDAR_FORM_1935 f 
                                    left join TRANSACTION_MASTER_1942 t on f.Id = t.SLOT
                                    left join (select * from PARTICIPANT_MASTER_1940 where EMAIL = '{UserEmail}') p on p.Id = t.STUDENT
                                    where f.IS_COURSE_EVENT = 'Y' and f.activities = '{ServiceId}'";

            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            sqlQuery = $@"select distinct substring(f.[start], 1, 10) as 'start' from CALENDAR_FORM_1935 f 
                                    left join TRANSACTION_MASTER_1942 t on f.Id = t.SLOT
                                    left join (select * from PARTICIPANT_MASTER_1940 where EMAIL = '{UserEmail}') p on p.Id = t.STUDENT
                                    where f.IS_COURSE_EVENT = 'Y' and f.activities = '{ServiceId}'";

            var Dates = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            Dictionary<string, List<IDictionary<string, object>>> finalData = new Dictionary<string, List<IDictionary<string, object>>>();

            Dates.ForEach(date =>
            {
                finalData.Add(Convert.ToDateTime(date["start"]?.ToString()).ToString("dddd - dd MMMM yyyy"), new List<IDictionary<string, object>>());
            });
            try
            {
                foreach (var element in Dates)
                {
                    var key = Convert.ToDateTime(element["start"]?.ToString()).ToString("dddd - dd MMMM yyyy");
                    var data = result.Where(x => Convert.ToDateTime(x["start"]?.ToString()).ToString("dddd - dd MMMM yyyy") == key).ToList();

                    finalData[key] = data;
                }
            }
            catch (Exception ex)
            {

            }
            

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = finalData.ToList() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetDefaultCompanyByUserId(string UserId)
        {

            string query = $@"select bau.ROLE_TYPE, f.* from BUSINESS_COMPANY_MASTER_1924 f
                            join BUSINESS_ASSIGNED_USERS_1964 bau on bau.COMPANY_ID = f.Id
                            where bau.ASSIGNED_USER = '{UserId}' and f.IS_DEFAULT = 'Y' and f.IS_ACTIVE = 'Y'";


            List<IDictionary<string, object>> BusinessCompanyResult = await sqlFunction.ExecuteSqlQuery(query);

            if (BusinessCompanyResult.Count > 0)
            {
                var businessCompany = BusinessCompanyResult.FirstOrDefault();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = businessCompany };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetSingleCompanyByCompanyCode(string CompanyCode)
        {
            string query = $@"SELECT company.[Id], company.[IS_TEMPLATE], company.TEMPLATE_ID,company.Latitude,company.Longitude, company.PALETTE_ID, country.COUNTRY_NAME as 'COMPANY_COUNTRY_NAME', city.CITY_NAME as 'COMPANY_CITY_NAME', district.DISTRICT_NAME as 'COMPANY_DISTRICT_NAME'     ,company.[created_at]      ,company.[updated_at]      ,company.[created_by]      ,company.[updated_by]      ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,company.[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID],     [COMPANY_EMAIL]      ,company.[COUNTRY_ID]      ,company.[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT],[IS_ACTIVE]  
                                FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                left join COUNTRY_MASTER_1926 country on country.Id = company.COUNTRY_ID
                                left join CITY_MASTER_1927 city on city.Id = company.CITY_ID
                                left join DISTRICT_MASTER_1928 district on district.Id = company.DISTRICT_ID
                                where IS_ACTIVE = 'Y' and  COMPANY_CODE = '{CompanyCode}'";

            List<IDictionary<string, object>> BusinessCompanyResult = await sqlFunction.ExecuteSqlQuery(query);

            if (BusinessCompanyResult.Count > 0)
            {
                var businessCompany = BusinessCompanyResult.FirstOrDefault();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = businessCompany };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }


        public async Task<AddUpdateDelete> GetCalanderCategoryNameList(string CompanyCode)
        {
            string query = $@"SELECT clcd.Id,clcd.CALENDAR_CATEGORY_NAME from CALENDAR_CATEGORY_MASTER_1929 clcd 
                        INNER JOIN BUSINESS_CALENDAR_MASTER_1925 bcl ON  bcl.CALENDAR_CATEGORY_ID=clcd.Id WHERE bcl.COMPANY_CODE= '{CompanyCode}'";

            List<IDictionary<string, object>> CalanderCategoryNameList = await sqlFunction.ExecuteSqlQuery(query);

            if (CalanderCategoryNameList.Count > 0)
            {
                List<IDictionary<string, object>> distinctResult = RemoveDuplicates(CalanderCategoryNameList, "Id");
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = distinctResult };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetCalanderSubCategoryNameList(string CompanyCode)
        {
            string query = $@"SELECT DISTINCT CSM.Id, CSM.CALENDAR_SUB_CATEGORY_NAME
                            FROM CALENDAR_SUB_CATEGORY_MASTER_1930 AS CSM
                            JOIN BUSINESS_CALENDAR_MASTER_1925 AS BCM ON CHARINDEX(',' + CAST(CSM.Id AS NVARCHAR(MAX)) + ',', ',' + BCM.CALENDAR_SUB_CATEGORY_ID + ',') > 0
                            where BCM.COMPANY_CODE= '{CompanyCode}'";

            List<IDictionary<string, object>> CalanderSubCategoryNameList = await sqlFunction.ExecuteSqlQuery(query);

            if (CalanderSubCategoryNameList.Count > 0)
            {
                List<IDictionary<string, object>> distinctResult = RemoveDuplicates(CalanderSubCategoryNameList, "Id");
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = distinctResult };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public static List<IDictionary<string, object>> RemoveDuplicates(List<IDictionary<string, object>> list, string key)
        {

            HashSet<object> hashSet = new HashSet<object>();
            return list.Where(dict => { var value = dict[key]; return hashSet.Add(value); }).ToList();
        }


        public async Task<AddUpdateDelete> UpdateBusinessCompanyProfileStatusByBusinessId(string businessId, bool isActive)
        {
            string isActiveString = "N";

            if (isActive)
            {
                isActiveString = "Y";
            }

            string query = $@"UPDATE BUSINESS_COMPANY_MASTER_1924 SET COMPANY_PROFILE_STATUS = '{isActiveString}' WHERE Id = '{businessId}'";

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

        public async Task<AddUpdateDelete> UpdateBusinessCompanyProfileStatusByUserId(string userId, bool isActive)
        {
            string isActiveString = "N";

            if (isActive)
            {
                isActiveString = "Y";
            }

            string query = $@"UPDATE BUSINESS_COMPANY_MASTER_1924 SET COMPANY_PROFILE_STATUS = '{isActiveString}' WHERE USER_ID = '{userId}'";

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

        public async Task<AddUpdateDelete> AddCompany(BusinessCompanyModel model, string UserName, string UserId, bool IsDefault = false)
        {
            AddUpdateDelete CompanyDetails = new AddUpdateDelete()
            {
                Status = false
            };

            if (!string.IsNullOrEmpty(model.Id))
            {
                CompanyDetails = await GetSingleCompanyById(model.Id);
            }

            if (!CompanyDetails.Status)
            {

                if (IsDefault)
                {
                    model.IS_DEFAULT = "Y";
                }
                else
                {
                    model.IS_DEFAULT = "N";
                }

                if (string.IsNullOrEmpty(model.IS_SEARCHABLE_IN_MARKETPLACE))
                {
                    model.IS_SEARCHABLE_IN_MARKETPLACE = "Y";
                }

                model.COUNTRY_ID = "1";
                model.CITY_ID = "1";
                model.DISTRICT_ID = "1";

                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.BUSINESS_COMPANY_MASTER;

                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                if (formResult.res == 1)
                {
                    string CompanyCode = "CMP" + formResult.Id.ToString().PadLeft(5, '0');

                    string query = $@"UPDATE [dbo].[BUSINESS_COMPANY_MASTER_1924] SET 
                               [updated_at] = getdate()
                              ,[COMPANY_CODE] = '{CompanyCode}'
                              WHERE Id = {formResult.Id}";
                    int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                    var website = await GetSingleBusinessWebsite(UserName);

                    if (website.Status)
                    {
                        //bool ActivateFreePlan = false;
                        bool ActivateFreePlan = true;

                        if (website.Data["COMPANY_PROFILE_STATUS"].ToString() == "N")
                        {
                            query = "update USER_MASTER_1915 set COMPANY_PROFILE_STATUS = 'Y', updated_at = '" + DateTimeUtility.Now().ToString("yyyy-MM-dd") + "' where USER_ID = '" + UserName + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (website.Data["CURRENT_STEP"].ToString() != "COMPLETED")
                        {
                            if (website.Data["CURRENT_STEP"].ToString() == "COMPANY PROFILE")
                            {
                                query = "update USER_MASTER_1915 set CURRENT_STEP = 'CALENDAR', updated_at = '" + DateTimeUtility.Now().ToString("yyyy-MM-dd") + "'  where USER_ID = '" + UserName + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                            }
                            else if (website.Data["CURRENT_STEP"].ToString() == "COMPANY WEBSITE")
                            {
                                query = "update USER_MASTER_1915 set CURRENT_STEP = 'COMPLETED', updated_at = '" + DateTimeUtility.Now().ToString("yyyy-MM-dd") + "'  where USER_ID = '" + UserName + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                                // registration and 3 steps are completed here and now activate free plan of user

                                //if (saveResult > 0)
                                //{
                                //    ActivateFreePlan = true;
                                //}

                            }
                        }
                        else
                        {
                            //ActivateFreePlan = true;
                        }

                        if (ActivateFreePlan)
                        {
                            AddUpdateDelete freeSubscription = await GetCompanyFreeSubscriptionDetails(formResult.Id.ToString());

                            if (!freeSubscription.Status)
                            {
                                var freeSubscriptionPackage = await GetFreeCompanyPackage();

                                if (freeSubscriptionPackage.Status)
                                {
                                    try
                                    {
                                        BusinessOrderModel businessOrderModel = new BusinessOrderModel()
                                        {
                                            BOOKING_SESSION_COMPANY = freeSubscriptionPackage.Data["VALID_BOOKING_SESSION"]?.ToString(),
                                            CALENDAR_AVAILABLE = freeSubscriptionPackage.Data["NUM_OF_AVAIL_CLR"]?.ToString(),
                                            PACKAGE_ID = freeSubscriptionPackage.Data["Id"]?.ToString(),
                                            PLAN_DESCRIPTION = freeSubscriptionPackage.Data["PLAN_DESC"]?.ToString(),
                                            PLAN_NAME = freeSubscriptionPackage.Data["PLAN_NAME"]?.ToString(),
                                            SESSION_MONTH_COMPANY = freeSubscriptionPackage.Data["VALID_SESSIONS"]?.ToString(),
                                            VALIDITY_DAYS = 30,
                                            VALID_TILL = DateTimeUtility.Now().AddMonths(1).ToString("yyyy-MM-dd HH:mm"),
                                            ORDER_PRICE = 0,
                                            USER_ID = UserId,
                                            ORDER_QTY = 1,
                                            IS_MONTHLY = "Y",
                                            COMPANY_ID = formResult.Id.ToString()
                                        };

                                        var orderResult = await masterService.CreateBusinessOrder(businessOrderModel);

                                        if (orderResult.Status)
                                        {
                                            CompanySubscriptionDetailsModel companySubscriptionDetailsModel = new CompanySubscriptionDetailsModel()
                                            {
                                                ASSIGNED_BOOKINGS = Convert.ToDouble(businessOrderModel.BOOKING_SESSION_COMPANY),
                                                ASSIGNED_CALENDARS = Convert.ToDouble(businessOrderModel.CALENDAR_AVAILABLE),
                                                ASSIGNED_SESSIONS = Convert.ToDouble(businessOrderModel.SESSION_MONTH_COMPANY),
                                                ORDER_ID = orderResult.Data,
                                                PLAN_ID = freeSubscriptionPackage.Data["Id"]?.ToString(),
                                                COMPANY_ID = formResult.Id.ToString(),
                                                IS_FREE_PLAN = "Y",
                                                IS_ACTIVE = "Y",
                                            };

                                            var subscriptionSaveResult = await AddCompanySubscriptionDetails(companySubscriptionDetailsModel);
                                        }
                                    }
                                    catch (Exception ex)
                                    {

                                    }


                                }
                            }
                        }

                        BusinessAssignedUsersModel businessAssignedUsersModel = new BusinessAssignedUsersModel()
                        {
                            ASSIGNED_USER = UserId,
                            COMPANY_ID = formResult.Id.ToString(),
                            ROLE_TYPE = "SUPERUSER"
                        };

                        var result = await AddBusinessAssignedUser(businessAssignedUsersModel);

                    }

                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = formResult.Id.ToString() };
                }
                else
                {
                    return new AddUpdateDelete() { Message = formResult.Message, Status = false };
                }

            }
            else
            {
                if (string.IsNullOrEmpty(model.IS_SEARCHABLE_IN_MARKETPLACE))
                {
                    model.IS_SEARCHABLE_IN_MARKETPLACE = "Y";
                }

                string LogoUpdateQuery = "";
                string BannerUpdateQuery = "";

                if (!string.IsNullOrEmpty(model.COMPANY_LOGO_PATH))
                {
                    LogoUpdateQuery = $@",[COMPANY_LOGO_NAME] = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_LOGO_NAME)}'
                                            ,[COMPANY_LOGO_PATH] = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_LOGO_PATH)}'";
                }

                if (!string.IsNullOrEmpty(model.COMPANY_BANNER_PATH))
                {
                    BannerUpdateQuery = $@",[COMPANY_BANNER_NAME] = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_BANNER_NAME)}'
                                            ,[COMPANY_BANNER_PATH] = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_BANNER_PATH)}'";
                }

                string query = $@"UPDATE [dbo].[BUSINESS_COMPANY_MASTER_1924] SET 
                               [updated_at] = getdate()
                              ,[COMPANY_NAME_ENGLISH] = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_NAME_ENGLISH)}'
                              ,[COMPANY_NAME_CHINESE] = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_NAME_CHINESE)}'
                              {LogoUpdateQuery}
                              {BannerUpdateQuery}
                              ,[COMPANY_PHONE] = '{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_PHONE)}'
                              ,[COMPANY_ADDRESS] = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_ADDRESS)}'
                              ,[FACEBOOK_URL] = '{SQLUtility.TreatSingleQuoteForQuery(model.FACEBOOK_URL)}'
                              ,[INSTAGRAM_URL] = '{SQLUtility.TreatSingleQuoteForQuery(model.INSTAGRAM_URL)}'
                              ,[WECHAT_URL] = '{SQLUtility.TreatSingleQuoteForQuery(model.WECHAT_URL)}'
                              ,[TWITTER_URL] = '{SQLUtility.TreatSingleQuoteForQuery(model.TWITTER_URL)}'
                              ,[PAGE_URL] = N'{SQLUtility.TreatSingleQuoteForQuery(model.PAGE_URL)}'
                              ,[COMPANY_DESCRIPTION] = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_DESCRIPTION)}'
                              ,[TAGS] = N'{SQLUtility.TreatSingleQuoteForQuery(model.TAGS)}'
                              ,[IS_SEARCHABLE_IN_MARKETPLACE] = '{model.IS_SEARCHABLE_IN_MARKETPLACE}'                              
                              ,[COUNTRY_ID] = '{model.COUNTRY_ID}'
                              ,[CITY_ID] = '{model.CITY_ID}'
                              ,[DISTRICT_ID] = '{model.DISTRICT_ID}'
                              ,[Latitude] = '{model.Latitude}'
                              ,[Longitude] = '{model.Longitude}'
                              WHERE Id = '{model.Id}'";
                //,[COMPANY_CATEGORY_ID] = '{model.COMPANY_CATEGORY_ID}'
                // ,[COMPANY_SUB_CATEGORY_ID] = '{model.COMPANY_SUB_CATEGORY_ID}'

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (saveResult > 0)
                {
                    var website = await GetSingleBusinessWebsite(UserName);

                    if (website.Status)
                    {
                        if (website.Data["COMPANY_PROFILE_STATUS"].ToString() == "N")
                        {
                            query = "update USER_MASTER_1915 set COMPANY_PROFILE_STATUS = 'Y', updated_at = getdate() where USER_ID = '" + UserName + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }


                        if (website.Data["CURRENT_STEP"].ToString() != "COMPLETED")
                        {
                            if (website.Data["CURRENT_STEP"].ToString() == "COMPANY PROFILE")
                            {
                                query = "update USER_MASTER_1915 set CURRENT_STEP = 'CALENDAR', updated_at = getdate()  where USER_ID = '" + UserName + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                            }
                            else if (website.Data["CURRENT_STEP"].ToString() == "COMPANY WEBSITE")
                            {
                                query = "update USER_MASTER_1915 set CURRENT_STEP = 'COMPLETED', updated_at = getdate()  where USER_ID = '" + UserName + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                            }

                            AddUpdateDelete freeSubscription = await GetCompanyFreeSubscriptionDetails(CompanyDetails.Data["Id"].ToString());

                            if (!freeSubscription.Status)
                            {
                                var freeSubscriptionPackage = await GetFreeCompanyPackage();

                                if (freeSubscriptionPackage.Status)
                                {
                                    BusinessOrderModel businessOrderModel = new BusinessOrderModel()
                                    {
                                        BOOKING_SESSION_COMPANY = freeSubscription.Data["BOOKING_SESSION_COMPANY"]?.ToString(),
                                        CALENDAR_AVAILABLE = freeSubscription.Data["CALENDAR_AVAILABLE"]?.ToString(),
                                        PACKAGE_ID = freeSubscription.Data["Id"]?.ToString(),
                                        PLAN_DESCRIPTION = freeSubscription.Data["PLAN_DESCRIPTION"]?.ToString(),
                                        PLAN_NAME = freeSubscription.Data["PLAN_NAME"]?.ToString(),
                                        SESSION_MONTH_COMPANY = freeSubscription.Data["SESSION_MONTH_COMPANY"]?.ToString(),
                                        VALIDITY_DAYS = 30,
                                        VALID_TILL = DateTimeUtility.Now().AddMonths(1).ToString("yyyy-MM-dd HH:mm"),
                                        ORDER_PRICE = 0,
                                        USER_ID = UserId,
                                        ORDER_QTY = 1,
                                        IS_MONTHLY = "Y",
                                        COMPANY_ID = CompanyDetails.Data["Id"].ToString()
                                    };

                                    var orderResult = await masterService.CreateBusinessOrder(businessOrderModel);

                                    if (orderResult.Status)
                                    {
                                        CompanySubscriptionDetailsModel companySubscriptionDetailsModel = new CompanySubscriptionDetailsModel()
                                        {
                                            ASSIGNED_BOOKINGS = Convert.ToDouble(businessOrderModel.BOOKING_SESSION_COMPANY),
                                            ASSIGNED_CALENDARS = Convert.ToDouble(businessOrderModel.CALENDAR_AVAILABLE),
                                            ASSIGNED_SESSIONS = Convert.ToDouble(businessOrderModel.SESSION_MONTH_COMPANY),
                                            ORDER_ID = orderResult.Data,
                                            PLAN_ID = freeSubscription.Data["Id"]?.ToString(),
                                            COMPANY_ID = CompanyDetails.Data["Id"].ToString(),
                                            IS_FREE_PLAN = "Y",
                                            IS_ACTIVE = "Y",
                                        };

                                        var subscriptionSaveResult = await AddCompanySubscriptionDetails(companySubscriptionDetailsModel);
                                    }
                                }

                            }

                        }

                    }


                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
        }

        public async Task<AddUpdateDelete> UpdateCompanyService(BusinessCompanyModel model)
        {

            string query = $@"UPDATE BUSINESS_COMPANY_MASTER_1924 SET COMPANY_SERVICE = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_SERVICE)}' WHERE Id = '{model.Id}'";

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

        public bool CheckCmpanyUrlExists(string PageName, string CompanyCode)
        {

            string query = $@"select PAGE_URL from BUSINESS_COMPANY_MASTER_1924 company
                                where PAGE_URL = '{PageName}' and company.COMPANY_CODE <> '{CompanyCode}'";

            var result = sqlFunction.ExecuteSqlQueryNonAsync(query);

            if (result.Count() > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<AddUpdateDelete> GetCompanyCodeByPageUrl(string PageUrl)
        {
            try
            {
                string query = $@"select COMPANY_CODE from BUSINESS_COMPANY_MASTER_1924 where PAGE_URL ='{PageUrl}'";

                var result = await sqlFunction.ExecuteSqlQuery(query);
                if (result.Count() > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
                }
                else
                {
                    string queryString = $@"select COMPANY_CODE from BUSINESS_COMPANY_MASTER_1924 where COMPANY_CODE ='{PageUrl}'";

                    var IResult = await sqlFunction.ExecuteSqlQuery(queryString);

                    if (IResult.Count() > 0)
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = IResult.FirstOrDefault() };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                    }



                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }

        }




        public async Task<AddUpdateDelete> UpdateTemplatePalette(BusinessCompanyModel model)
        {
            try
            {
                string query = $@"UPDATE BUSINESS_COMPANY_MASTER_1924 SET TEMPLATE_ID = '{model.TEMPLATE_ID}',PALETTE_ID = '{model.PALETTE_ID}' WHERE Id = '{model.Id}'";

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
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }

        }

        public async Task<AddUpdateDelete> GetCompanyActiveSubscriptionDetails(string Id, bool isCompanyCode = false)
        {

            string query = "";

            if (isCompanyCode)
            {
                query = $@"select subsdet.Id as 'SUBS_ID', subsdet.ASSIGNED_CALENDARS, subsdet.ASSIGNED_BOOKINGS, subsdet.ASSIGNED_SESSIONS, bom.* from COMPANY_SUBSCRIPTION_DETAILS_1939 subsdet
                            join BUSINESS_COMPANY_MASTER_1924 company on company.Id = subsdet.COMPANY_ID
                            join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = subsdet.ORDER_ID
                            where company.COMPANY_CODE = '{Id}' and subsdet.IS_ACTIVE = 'Y'";
            }
            else
            {
                query = $@"select subsdet.Id as 'SUBS_ID', subsdet.ASSIGNED_CALENDARS, subsdet.ASSIGNED_BOOKINGS, subsdet.ASSIGNED_SESSIONS, bom.* from COMPANY_SUBSCRIPTION_DETAILS_1939 subsdet
                            join BUSINESS_COMPANY_MASTER_1924 company on company.Id = subsdet.COMPANY_ID
                            join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = subsdet.ORDER_ID
                            where company.Id = '{Id}' and subsdet.IS_ACTIVE = 'Y'";
            }

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                try
                {
                    var validTill = Convert.ToDateTime(result[0]["VALID_TILL"]?.ToString());
                    if (validTill < DateTimeUtility.Now())
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Your Subscription Plan is Expired", Data = result.FirstOrDefault() };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
                    }
                }
                catch (Exception ex)
                {
                    return new AddUpdateDelete() { Status = false, Message = "No Active Subscription Plan" };
                }
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "No Active Subscription Plan" };
            }

        }

        public async Task<AddUpdateDelete> GetSessionsForThisMonth(string CompanyCode, string CalendarCode)
        {
            string query = $@"  declare @CompanyCode varchar(100) = '{CompanyCode}';
                                declare @CalendarCode varchar(100) = '{CalendarCode}';
                                declare @SubscriptionDate varchar(200);
                                declare @SubscriptionEndDate varchar(200);
                                set @SubscriptionDate = (select top 1 f.created_at from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)
                                set @SubscriptionEndDate = (select top 1 bom.VALID_TILL from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)

                                if(@SubscriptionDate is not null and @SubscriptionEndDate is not null)
                                begin
	                                declare @StartDate datetime;
	                                declare @EndDate datetime;
	                                declare @Validity varchar(2) = 'N';

	                                set @StartDate = cast(@SubscriptionDate as datetime);
	                                set @EndDate = cast(DATEADD(MONTH, 1, @StartDate) as datetime);
	
	                                while (cast(@EndDate as datetime) <= cast(@SubscriptionEndDate as datetime)) 
	                                begin
		                                if(@StartDate <= cast(getDate() as datetime) and cast(getDate() as datetime) <= @EndDate)
		                                begin
			                                set @Validity = 'Y'
			                                break;
		                                end
		                                else
		                                begin
			                                set @StartDate = @EndDate
			                                set @EndDate = cast(DATEADD(MONTH, 1, @EndDate) as datetime)
		                                end
		
	                                end
	
	                                if(@Validity = 'Y')
		                                with cte as (
		                                    select count(*) as 'CREATED_EVENTS',
		                                    ((select top 1 f.ASSIGNED_SESSIONS from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)) as 'ASSIGNED_SESSIONS',
                                            ((select top 1 bom.VALID_TILL from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID  where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)) as 'VALID_TILL'		                                    
                                            from CALENDAR_FORM_1935 f
		                                    where f.COMPANY_CODE = @CompanyCode and f.CALENDAR_CODE = @CalendarCode and created_at >= @StartDate and created_at <= @EndDate)
		                                    select *, (ASSIGNED_SESSIONS - CREATED_EVENTS) as 'AVAILABLE_SESSIONS' from cte
	                                else 
		                                select null as 'result'
                                end
                                else
	                                select null as 'result'";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                if (result.Any(x => x.ContainsKey("result")))
                {
                    return new AddUpdateDelete() { Status = false, Message = "You Don't have any active subscription plan" };
                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
                }
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "You Don't have any active subscription plan" };
            }

        }

        public async Task<AddUpdateDelete> GetSessionsForThisMonthCalendarWise(string CompanyCode)
        {
            try
            {
                string query = $@"declare @CompanyCode varchar(100) = '{CompanyCode}';
                                declare @SubscriptionDate varchar(200);
                                declare @SubscriptionEndDate varchar(200);
                                set @SubscriptionDate = (select top 1 f.created_at from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)
                                set @SubscriptionEndDate = (select top 1 bom.VALID_TILL from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)

                                if(@SubscriptionDate is not null and @SubscriptionEndDate is not null)
                                begin
	                                declare @StartDate datetime;
	                                declare @EndDate datetime;
	                                declare @Validity varchar(2) = 'N';

	                                set @StartDate = cast(@SubscriptionDate as datetime);
	                                set @EndDate = cast(DATEADD(MONTH, 1, @StartDate) as datetime);
	
	                                while (cast(@EndDate as datetime) <= cast(@SubscriptionEndDate as datetime)) 
	                                begin
		                                if(@StartDate <= cast(getDate() as datetime) and cast(getDate() as datetime) <= @EndDate)
		                                begin
			                                set @Validity = 'Y'
			                                break;
		                                end
		                                else
		                                begin
			                                set @StartDate = @EndDate
			                                set @EndDate = cast(DATEADD(MONTH, 1, @EndDate) as datetime)
		                                end
		
	                                end
	
	                                if(@Validity = 'Y')
		                                with cte as (
											select 
                                            f.created_at,
											f.CALENDAR_NAME, 
											csd.ASSIGNED_SESSIONS,
											(select count(*) from CALENDAR_FORM_1935 where CALENDAR_CODE = f.CALENDAR_CODE and created_at >= @StartDate and created_at <= @EndDate) as 'SESSIONS_CREATED'
											from BUSINESS_CALENDAR_MASTER_1925 f
											JOIN BUSINESS_COMPANY_MASTER_1924 CMP ON CMP.COMPANY_CODE = F.COMPANY_CODE
											left Join (select * from COMPANY_SUBSCRIPTION_DETAILS_1939 where IS_ACTIVE = 'Y') csd on csd.COMPANY_ID = CMP.Id
		                                    where f.COMPANY_CODE = @CompanyCode and f.IS_VISIBLE = 'Y'
											
										)
		                                select * from cte ORDER BY created_at DESC
	                                else 
		                                select null as 'result'
                                end
                                else
	                                select null as 'result'";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    if (result.Any(x => x.ContainsKey("result")))
                    {
                        return new AddUpdateDelete() { Status = false, Message = "You Don't have any active subscription plan" };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.ToList() };
                    }
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "You Don't have any active subscription plan" };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = "You Don't have any active subscription plan" };
            }


        }

        public async Task<AddUpdateDelete> CheckCreditLimit(string CompanyCode)
        {
            string query = $@"declare @CompanyCode varchar(100) = '{CompanyCode}';
                                declare @SubscriptionDate varchar(200);
                                declare @SubscriptionEndDate varchar(200);
                                set @SubscriptionDate = (select top 1 f.created_at from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)
                                set @SubscriptionEndDate = (select top 1 bom.VALID_TILL from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)

                                if(@SubscriptionDate is not null and @SubscriptionEndDate is not null)
                                begin
	                                declare @StartDate datetime;
	                                declare @EndDate datetime;
	                                declare @Validity varchar(2) = 'N';

	                                set @StartDate = cast(@SubscriptionDate as datetime);
	                                set @EndDate = cast(DATEADD(MONTH, 1, @StartDate) as datetime);
	
	                                while (cast(@EndDate as datetime) <= cast(@SubscriptionEndDate as datetime)) 
	                                begin
		                                if(@StartDate <= cast(getDate() as datetime) and cast(getDate() as datetime) <= @EndDate)
		                                begin
			                                set @Validity = 'Y'
			                                break;
		                                end
		                                else
		                                begin
			                                set @StartDate = @EndDate
			                                set @EndDate = cast(DATEADD(MONTH, 1, @EndDate) as datetime)
		                                end
		
	                                end
	
	                                if(@Validity = 'Y')
		                                with cte as (
		                                    select count(*) as 'CREATED_EVENTS',
		                                    ((select top 1 f.ASSIGNED_SESSIONS from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)) as 'ASSIGNED_SESSIONS',
                                            ((select top 1 bom.VALID_TILL from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID  where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)) as 'VALID_TILL'		                                    
                                            from CALENDAR_FORM_1935 f
		                                    where f.COMPANY_CODE = @CompanyCode and created_at >= @StartDate and created_at <= @EndDate)
		                                    select *, (ASSIGNED_SESSIONS - CREATED_EVENTS) as 'AVAILABLE_SESSIONS' from cte
	                                else 
		                                select null as 'result'
                                end
                                else
	                                select null as 'result'";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                if (result.Any(x => x.ContainsKey("result")))
                {
                    return new AddUpdateDelete() { Status = false, Message = "You Don't have any active subscription plan" };
                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
                }
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "You Don't have any active subscription plan" };
            }

        }

        public async Task<AddUpdateDelete> GetBookingsForThisMonth(string CompanyCode, string SlotId)
        {
            string query = $@"declare @CompanyCode varchar(100) = '{CompanyCode}';
                                declare @SubscriptionDate varchar(200);
                                declare @SubscriptionEndDate varchar(200);
                                set @SubscriptionDate = (select top 1 f.created_at from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)
                                set @SubscriptionEndDate = (select top 1 bom.VALID_TILL from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)

                                if(@SubscriptionDate is not null and @SubscriptionEndDate is not null)
                                begin
	                                declare @StartDate datetime;
	                                declare @EndDate datetime;
	                                declare @Validity varchar(2) = 'N';

	                                set @StartDate = cast(@SubscriptionDate as datetime);
	                                set @EndDate = cast(DATEADD(MONTH, 1, @StartDate) as datetime);
	
	                                while (cast(@EndDate as datetime) <= cast(@SubscriptionEndDate as datetime)) 
	                                begin
		                                if(@StartDate <= cast(getDate() as datetime) and cast(getDate() as datetime) <= @EndDate)
		                                begin
			                                set @Validity = 'Y'
			                                break;
		                                end
		                                else
		                                begin
			                                set @StartDate = @EndDate
			                                set @EndDate = cast(DATEADD(MONTH, 1, @EndDate) as datetime)
		                                end
		
	                                end
	
	                                if(@Validity = 'Y')
		                               with cte as (
		                                    select count(*) as 'MONTHLY_BOOKINGS',
		                                    ((select top 1 f.ASSIGNED_BOOKINGS from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)) as 'ASSIGNED_BOOKINGS'
		                                    from TRANSACTION_MASTER_1942 f
		                                    join CALENDAR_FORM_1935 clf on clf.Id = f.SLOT
		                                    where f.SLOT = '{SlotId}' and f.COMPANY_CODE = @CompanyCode and f.created_at >= @StartDate and f.created_at <= @EndDate
		                                    )
		                                    select *, (ASSIGNED_BOOKINGS - MONTHLY_BOOKINGS) as 'AVAILABLE_BOOKINGS' from cte
	                                else 
		                                select null as 'result'
                                end
                                else
	                                select null as 'result'";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                if (result.Any(x => x.ContainsKey("result")))
                {
                    return new AddUpdateDelete() { Status = false, Message = "Unable to book this event" };
                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
                }
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "Unable to book this event" };
            }

        }

        public async Task<AddUpdateDelete> AddCalendar(BusinessCalendarModel model, string UserId)
        {
            AddUpdateDelete CalendarDetails = new AddUpdateDelete()
            {
                Status = false
            };

            if (!string.IsNullOrEmpty(model.Id))
            {
                CalendarDetails = await GetSingleCalendarById(model.Id);
            }

            if (!CalendarDetails.Status)
            {
                string sqlQuery = $@"select * from BUSINESS_CALENDAR_MASTER_1925 f
                                        join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                        where f.COMPANY_CODE = '{model.COMPANY_CODE}'";

                var companiesCreated = await sqlFunction.ExecuteSqlQuery(sqlQuery);

                sqlQuery = $@"select ASSIGNED_CALENDARS from COMPANY_SUBSCRIPTION_DETAILS_1939 subsdet
                                join BUSINESS_COMPANY_MASTER_1924 company on company.Id = subsdet.COMPANY_ID
                                where company.COMPANY_CODE = '{model.COMPANY_CODE}' and subsdet.IS_ACTIVE = 'Y'";

                var package = await GetCompanyActiveSubscriptionDetails(model.COMPANY_CODE, true);

                if (package.Status)
                {
                    if (Convert.ToInt32(package.Data["ASSIGNED_CALENDARS"]?.ToString()) > 0)
                    {

                        Form_DataTable data = new Form_DataTable();
                        data.action = (int)FormAction.Save;
                        data.formId = (int)FormSetting.BUSINESS_CALENDAR_MASTER;
                        data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
                        data.formGroupKey = Guid.NewGuid().ToString();
                        var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                        if (formResult.res == 1)
                        {
                            model.CALENDAR_CODE = "CLR" + formResult.Id.ToString().PadLeft(5, '0');

                            string query = $@"UPDATE [dbo].[BUSINESS_CALENDAR_MASTER_1925]
                                   SET [CALENDAR_CODE] = '{model.CALENDAR_CODE}'
                                 WHERE Id = '{formResult.Id.ToString()}';
                                
                                 update COMPANY_SUBSCRIPTION_DETAILS_1939 set ASSIGNED_CALENDARS = ASSIGNED_CALENDARS - 1 where COMPANY_ID = (select Id from BUSINESS_COMPANY_MASTER_1924 where COMPANY_CODE = '{model.COMPANY_CODE}') and IS_ACTIVE = 'Y'
                            ";

                            int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                            var website = await GetSingleBusinessWebsite(UserId);

                            if (website.Status)
                            {
                                if (website.Data["COMPANY_CALENDAR_STATUS"].ToString() == "N")
                                {
                                    query = "update USER_MASTER_1915 set COMPANY_CALENDAR_STATUS = 'Y', updated_at = getdate() where USER_ID = '" + UserId + "'";
                                    saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                                }

                                if (website.Data["CURRENT_STEP"].ToString() == "CALENDAR")
                                {
                                    query = "update USER_MASTER_1915 set CURRENT_STEP = 'COMPANY WEBSITE', updated_at = getdate()  where USER_ID = '" + UserId + "'";
                                    saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                                }
                            }

                            return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = formResult.Id.ToString() };
                        }
                        else
                        {
                            return new AddUpdateDelete() { Message = formResult.Message, Status = false };
                        }
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Calendar Limit Reached. Upgrade your Plan to create new calendars." };
                    }

                }
                else
                {
                    return package;
                }

            }
            else
            {
                string CalendarPhotoQuery = "";

                if (!string.IsNullOrEmpty(model.CALENDAR_PHOTO_PATH))
                {
                    CalendarPhotoQuery = $@",[CALENDAR_PHOTO_NAME] = '{SQLUtility.TreatSingleQuoteForQuery(model.CALENDAR_PHOTO_NAME)}'
                                            ,[CALENDAR_PHOTO_PATH] = '{SQLUtility.TreatSingleQuoteForQuery(model.CALENDAR_PHOTO_PATH)}'";
                }

                string query = $@"UPDATE [dbo].[BUSINESS_CALENDAR_MASTER_1925]
                                   SET [updated_at] = getdate()
                                      ,[CALENDAR_NAME] = N'{SQLUtility.TreatSingleQuoteForQuery(model.CALENDAR_NAME)}'
                                       {CalendarPhotoQuery}
                                      ,[TAGS] = N'{model.TAGS}'
                                      ,[IS_VISIBLE] = '{model.IS_VISIBLE}'
                                      ,[COUNTRY_ID] = '{model.COUNTRY_ID}'
                                      ,[CITY_ID] = '{model.CITY_ID}'
                                      ,[SLOT_DURATION_IN_MINS] = '{model.SLOT_DURATION_IN_MINS}'
                                      ,[DISTRICT_ID] = '{model.DISTRICT_ID}'
                                      ,[CALENDAR_COMMON_CATEGORY_ID] = '{model.CALENDAR_COMMON_CATEGORY_ID}'
                                      ,[CALENDAR_SUB_CATEGORY_ID] = '{model.CALENDAR_SUB_CATEGORY_ID}'
                                      ,[CALENDAR_USE_TYPE] = '{model.CALENDAR_USE_TYPE}'
                                      ,[DISPLAY_MIN_TIME] = '{model.DISPLAY_MIN_TIME}'
                                      ,[DISPLAY_MAX_TIME] = '{model.DISPLAY_MAX_TIME}'
                                      ,[DEFAULT_RESOURCE] = '{model.DEFAULT_RESOURCE}'
                                      ,[DEFAULT_DATE] = '{model.DEFAULT_DATE}'
                                      ,[NEED_ADDITIONAL_FORM] = '{model.NEED_ADDITIONAL_FORM}'
                                      ,[ALLOW_OVERLAP] = '{model.ALLOW_OVERLAP}'
                                      ,[DEFAULT_CALENDAR_VIEW] = '{model.DEFAULT_CALENDAR_VIEW}'
                                      ,[REQUIRED_CALENDAR_VIEWS] = '{model.REQUIRED_CALENDAR_VIEWS}'
                                      ,[COMPANY_CODE] = '{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_CODE)}'
                                      ,[INTERVAL_TIME]='{model.INTERVAL_TIME}'
                                 WHERE Id = '{model.Id}'
                                 ";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (saveResult > 0)
                {
                    var website = await GetSingleBusinessWebsite(UserId);

                    if (website.Status)
                    {
                        if (website.Data["COMPANY_CALENDAR_STATUS"].ToString() == "N")
                        {
                            query = "update USER_MASTER_1915 set COMPANY_CALENDAR_STATUS = 'Y', updated_at = getdate() where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (website.Data["CURRENT_STEP"].ToString() == "CALENDAR")
                        {
                            query = "update USER_MASTER_1915 set CURRENT_STEP = 'COMPANY WEBSITE', updated_at = getdate()  where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }
                    }


                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
                }
            }
        }

        public async Task<AddUpdateDelete> AddCompanySubscriptionDetails(CompanySubscriptionDetailsModel model)
        {
            AddUpdateDelete CompanyDetails = new AddUpdateDelete()
            {
                Status = false
            };

            if (!string.IsNullOrEmpty(model.COMPANY_ID))
            {
                CompanyDetails = await GetSingleCompanyById(model.COMPANY_ID);
            }

            string query = $@"select top 1
                                f.ASSIGNED_CALENDARS as 'TOTAL_CAL',
                                f.ASSIGNED_SESSIONS as 'TOTAL_SESSIONS'
                                from COMPANY_SUBSCRIPTION_DETAILS_1939 f where COMPANY_ID = '{model.COMPANY_ID}' and (f.ASSIGNED_SESSIONS != -1 and f.ASSIGNED_CALENDARS != -1) order by created_at desc";
            var checkData = await sqlFunction.ExecuteSqlQuery(query);

            if (CompanyDetails.Status)
            {
                if (checkData.Count > 0)
                {
                    if (model.ASSIGNED_CALENDARS != -1)
                        model.ASSIGNED_CALENDARS += Convert.ToDouble(checkData[0]["TOTAL_CAL"]?.ToString());
                }

                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.COMPANY_SUBSCRIPTION_DETAILS;

                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                string sqlQuery = $@"update COMPANY_SUBSCRIPTION_DETAILS_1939 set IS_ACTIVE = 'N' where COMPANY_ID = '{model.COMPANY_ID}' and Id != '{formResult.Id.ToString()}'";
                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlQuery);

                if (formResult.res == 1)
                {
                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = formResult.Id.ToString() };
                }
                else
                {
                    return new AddUpdateDelete() { Message = formResult.Message, Status = false };
                }

            }
            else
            {
                return new AddUpdateDelete() { Message = AppMessage.NotFound, Status = false };
            }




        }

        public async Task<AddUpdateDelete> GetCompanyFreeSubscriptionDetails(string CompanyId)
        {
            string query = $@"SELECT *
                          FROM [dbo].[COMPANY_SUBSCRIPTION_DETAILS_1939] WHERE IS_FREE_PLAN = 'Y' and IS_ACTIVE = 'Y' and COMPANY_ID = '{CompanyId}' order by created_at desc";

            List<IDictionary<string, object>> Result = await sqlFunction.ExecuteSqlQuery(query);

            if (Result.Count > 0)
            {
                var freeSubscription = Result.FirstOrDefault();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = freeSubscription };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetFreeCompanyPackage()
        {
            string query = $@"SELECT *
                          FROM [dbo].[BUSINESS_PLAN_MASTER_1966] WHERE IS_FREE_PLAN = 'Y' and PLAN_STATUS = 'ACTIVE' and PLAN_PRICE = 0 order by created_at desc";

            List<IDictionary<string, object>> Result = await sqlFunction.ExecuteSqlQuery(query);

            if (Result.Count > 0)
            {
                var freeSubscription = Result.FirstOrDefault();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = freeSubscription };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        //public async Task<AddUpdateDelete> GetCompanyActiveSubscriptionDetails(string CompanyId)
        //{
        //    string query = $@"SELECT *
        //                  FROM [dbo].[COMPANY_SUBSCRIPTION_DETAILS_1939] WHERE COMPANY_ID = '{CompanyId}' and IS_ACTIVE = 'Y' order by created_at desc";

        //    List<IDictionary<string, object>> Result = await sqlFunction.ExecuteSqlQuery(query);

        //    if (Result.Count > 0)
        //    {
        //        var freeSubscription = Result.FirstOrDefault();
        //        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = freeSubscription };
        //    }
        //    else
        //    {
        //        return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
        //    }
        //}

        public async Task<AddUpdateDelete> GetCompanyPaymentHistory(GenerateDynamicFormData data, string CompanyId)
        {
            Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "ORDER_ID","history.ORDER_ID"},
                    { "SUBSCRIPTION_PLAN_NAME","subscriptionPlan.PLAN_NAME"},
                    { "PAYMENT_DESCRIPTION","history.PAYMENT_DESCRIPTION"},
                    { "PAYMENT_METHOD","history.PAYMENT_METHOD"},
                    { "HKD","history.HKD"},
                    { "PAYMENT_DATE","history.PAYMENT_DATE"},
                    { "PAYMENT_STATUS","history.PAYMENT_STATUS"},
            };

            string column = "", dir = "";
            if (data.sorters != null && data.sorters.Count() > 0)
            {
                column = data.sorters.FirstOrDefault().field;
                dir = data.sorters.FirstOrDefault().dir;
            }
            else
            {
                column = "PAYMENT_DATE";
                dir = "desc";
            }

            List<string> applyFilter = new List<string>();
            if (data.filters != null && data.filters.Count() > 0)
            {
                foreach (var item in data.filters)
                {
                    if (filters.Any(x => x.Key == item.field) && !string.IsNullOrEmpty(item.value))
                    {
                        if (item.field == "PAYMENT_DATE")
                        {
                            string filter = await sqlFunction.GetDateFilter(item, "history");
                            applyFilter.Add(filter);
                        }
                        else
                        {
                            string filter = filters[item.field] + " like N'%" + item.value + "%'";
                            applyFilter.Add(filter);
                        }
                    }
                }
            }

            string applyFilterQuery = string.Join(" and ", applyFilter);
            applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

            int PageSize = data.size > 0 ? data.size : 20;
            int PageNumber = data.page > 0 ? data.page : 1;

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    SELECT history.[Id]
                                          ,history.[created_at] 
                                          ,history.[updated_at]
                                          ,history.[created_by]
                                          ,history.[updated_by]
                                          ,[ORDER_ID]
                                          ,[PAYMENT_ID]
                                          ,[PLAN_ID]
	                                      ,subscriptionPlan.PLAN_NAME
                                          ,[PAYMENT_DESCRIPTION]
                                          ,[PAYMENT_METHOD]
                                          ,[HKD]
                                          ,[PAYMENT_DATE]
                                          ,[PAYMENT_STATUS]
                                          ,[COMPANY_ID]
                                      FROM [dbo].[COMPANY_PAYMENT_HISTORY_MASTER_1937] history
                                      join BUSINESS_COMPANY_MASTER_1924 company on company.Id = history.COMPANY_ID
                                      join BUSINESS_PLAN_MASTER_1966 subscriptionPlan on subscriptionPlan.Id = history.PLAN_ID
                                      where company.IS_ACTIVE = 'Y' and company.Id = '{CompanyId}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";
            var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);

            if (result.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> AddSchedularForm(SchedularFormModel model, string formGroupKey)
        {
            bool createNewSchedule = false;
            if (!string.IsNullOrEmpty(model.Id))
            {
                if (Convert.ToInt32(model.Id) > 0)
                {
                    createNewSchedule = false;
                }
                else
                {
                    createNewSchedule = true;
                }

            }
            else
            {
                createNewSchedule = true;
            }

            if (createNewSchedule)
            {
                Form_DataTable data = new Form_DataTable();
                var a = model.ToDictionary();
                a.Remove("table");
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.SCHEDULAR_FORM;
                data.userId = (int)FormSetting.CreatedUser;
                data.created_by = (int)FormSetting.CreatedUser;
                data.updated_by = (int)FormSetting.CreatedUser;
                data.created_at = DateTimeUtility.Now().ToString();
                data.updated_at = DateTimeUtility.Now().ToString();
                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(a);
                data.formGroupKey = formGroupKey;

                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                if (formResult.res == 1)
                {
                    Form_DataTable result = new Form_DataTable()
                    {
                        Id = formResult.Id,
                        formGroupKey = data.formGroupKey
                    };


                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = result };
                }
                else
                {
                    return new AddUpdateDelete() { Message = formResult.Message, Status = false };
                }
            }
            else
            {
                string query = $@"UPDATE [dbo].[SCHEDULAR_FORM_1941] 
                                  SET 
                                           [updated_at] = getdate()
                                          ,[SCH__NAME] = '{SQLUtility.TreatSingleQuoteForQuery(model.SCH__NAME)}'
                                          ,[SCH_LOCATION] = '{model.SCH_LOCATION}'
                                          ,[SCH_ACTIVITY] = '{model.SCH_ACTIVITY}'
                                          ,[SCH_RESOURCE] = '{model.SCH_RESOURCE}'
                                          ,[SCH_FROM_DATE] = '{model.SCH_FROM_DATE}'
                                          ,[SCH_TO_DATE] = '{model.SCH_TO_DATE}'
                                          ,[SCH_DAYS] = '{model.SCH_DAYS}'
                                          ,[SCH_ALTERNATIVE_WEEK] = '{model.SCH_ALTERNATIVE_WEEK}'
                                          ,[SCH_SCHEDULE_TABLE] = '{model.SCH_SCHEDULE_TABLE}'
                                  WHERE Id = '{model.Id}'";

                var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (result > 0)
                {
                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false };
                }
            }

        }

        public async Task<AddUpdateDelete> DeleteSchedule(int ScheduleId, bool deleteForm)
        {
            try
            {
                string query = $@"declare @scheduleId int = {ScheduleId}

                                    declare @Ids varchar(max) = stuff((select ',' + cast(cf.Id as varchar(20)) from CALENDAR_FORM_1935 cf 
                                    left join TRANSACTION_MASTER_1942 t on t.SLOT = cf.Id
                                    where cf.SCHEDULAR_FORM_ID = @scheduleId and t.Id is null for xml path('')), 1, 1, '');

                                    declare @TotalRecords int = (select count(cf.Id) from CALENDAR_FORM_1935 cf 
                                    where cf.SCHEDULAR_FORM_ID = @scheduleId)

                                    declare @DeletableCount int = (select count(cf.Id) from CALENDAR_FORM_1935 cf 
                                    left join TRANSACTION_MASTER_1942 t on t.SLOT = cf.Id
                                    where cf.SCHEDULAR_FORM_ID = @scheduleId and t.Id is null)

                                    if(@DeletableCount >= @TotalRecords and 1 = {((deleteForm) ? "1" : "0")})
                                    begin
	                                    delete from SCHEDULAR_FORM_1941 where Id = @scheduleId
                                    end

                                    delete from CALENDAR_FORM_1935 where Id in (select cast(item as integer) from dbo.SplitString(@Ids, ','));

                                    select @TotalRecords as 'TotalRecords', @DeletableCount as 'DeletableRecords';";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    if (Convert.ToInt32(result[0]["DeletableRecords"]?.ToString()) >= Convert.ToInt32(result[0]["TotalRecords"]))
                    {
                        return new AddUpdateDelete() { Status = true, Message = "Schedule Deleted Successfully", Data = result };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = (result[0]["DeletableRecords"]?.ToString() + " slots deleted because all other slots are already having booking.\n Cancel the bookings and try again if you want to delete those slots."), Data = result };
                    }
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Everything went wrong" };
                }


            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = "Failed to delete" };
            }
        }

        public async Task<AddUpdateDelete> AddQueueSession(List<QueueMasterModel> queues, List<SessionMasterModel> sessions, string ScheduleId)
        {
            try
            {
                List<int> queueIds = new List<int>();
                List<int> sessionIds = new List<int>();
                string CalendarCode = queues.FirstOrDefault().CALENDAR_CODE;
                string CompanyCode = queues.FirstOrDefault().COMPANY_CODE;

                if (queues.Count > 0)
                {
                    foreach (var queue in queues)
                    {
                        int queueId = 0;

                        if (string.IsNullOrEmpty(queue.Id))
                        {
                            Form_DataTable data = new Form_DataTable();
                            data.action = (int)FormAction.Save;
                            data.formId = (int)FormSetting.QUEUE_MASTER;

                            data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(queue.ToDictionary());
                            data.formGroupKey = Guid.NewGuid().ToString();
                            var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                            queueId = formResult.Id;
                        }
                        else
                        {
                            queueId = Convert.ToInt32(queue.Id);
                        }

                        queueIds.Add(queueId);
                    }

                    foreach (var session in sessions.Where(x => string.IsNullOrEmpty(x.Id)))
                    {
                        int sessionId = 0;

                        Form_DataTable data2 = new Form_DataTable();
                        data2.action = (int)FormAction.Save;
                        data2.formId = (int)FormSetting.SESSION_MASTER;

                        data2.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(session.ToDictionary());
                        data2.formGroupKey = Guid.NewGuid().ToString();
                        var formResult2 = (await formAPIRepository.GeneratedFormData(data2)).Data;

                        if (formResult2.res == 1)
                        {
                            sessionId = formResult2.Id;

                            sessionIds.Add(sessionId);
                        }
                    }

                    foreach (var x in queueIds)
                    {
                        foreach (var y in sessionIds)
                        {
                            Form_DataTable data3 = new Form_DataTable();
                            data3.action = (int)FormAction.Save;
                            data3.formId = (int)FormSetting.QUEUE_SESSION_MAPPING;

                            data3.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(new QueueSessionMappingModel()
                            {
                                CALENDAR_CODE = CalendarCode,
                                COMPANY_CODE = CompanyCode,
                                QUEUE_ID = x.ToString(),
                                SCHEDULE_ID = ScheduleId.ToString(),
                                SESSION_ID = y.ToString()
                            }.ToDictionary());
                            data3.formGroupKey = Guid.NewGuid().ToString();
                            var formResult3 = (await formAPIRepository.GeneratedFormData(data3)).Data;
                        };
                    }
                }

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.ToString() };
            }
        }

        public async Task<AddUpdateDelete> UpdateQueueDetails(List<QueueMasterModel> model)
        {
            try
            {
                string query = "";

                for (int i = 0; i < model.Count; i++)
                {
                    query += $@"UPDATE [dbo].[QUEUE_MASTER_1973]
                                   SET [QUEUE_BY] = N'{model[i].QUEUE_BY}'
                                      ,[QUEUE_RESOURCE_ID] = '{model[i].QUEUE_RESOURCE_ID}'
                                      ,[QUEUE_NAME] = N'{SQLUtility.TreatSingleQuoteForQuery(model[i].QUEUE_NAME)}'
                                      ,[QUEUE_USAGE] = N'{model[i].QUEUE_USAGE}'
                                      ,[QUEUE_PREFIX] = N'{model[i].QUEUE_PREFIX}'
                                      ,[ACCEPT_TICKET] = N'{model[i].ACCEPT_TICKET}'
                                      ,[QUEUE_START_NUMBER] = '{model[i].QUEUE_START_NUMBER}'
                                      ,[QUEUE_END_NUMBER] = '{model[i].QUEUE_END_NUMBER}'
                                      ,[QUEUE_RESET_NUMBER] = '{model[i].QUEUE_RESET_NUMBER}'
                                 WHERE Id = '{model[i].Id}'";
                }

                var Result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (Result > 0)
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

        public async Task<AddUpdateDelete> UpdateSessionDetails(List<SessionMasterModel> model)
        {
            try
            {
                string query = "";

                for (int i = 0; i < model.Count; i++)
                {
                    query += $@"UPDATE [dbo].[QUEUE_MASTER_1973]
                                   SET [SESSION_NAME] = {SQLUtility.TreatSingleQuoteForQuery(model[i].SESSION_NAME)}
                                  ,[SESSION_START_TIME] ={model[i].SESSION_START_TIME}
                                  ,[SESSION_END_TIME] = {model[i].SESSION_END_TIME}
                                  ,[TICKETING_TYPE] = {model[i].TICKETING_TYPE}
                                  ,[QUEUE_OPEN_TIME] = {model[i].QUEUE_OPEN_TIME}
                                 WHERE Id = '{model[i].Id}'";

                }

                var Result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (Result > 0)
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

        public async Task<AddUpdateDelete> GetQueueAndSession(string CompanyCode, string CalendarCode)
        {
            try
            {
                string query = $@"select * from QUEUE_MASTER_1973 where CALENDAR_CODE = '{CalendarCode}' and COMPANY_CODE = '{CompanyCode}'";

                List<IDictionary<string, object>> Result = await sqlFunction.ExecuteSqlQuery(query);

                query = $@"select * from QUEUE_SESSION_MASTER_1974 ses where CALENDAR_CODE = '{CalendarCode}' and COMPANY_CODE = '{CompanyCode}'  and 
                                    (
	                                    Convert(datetime, '{DateTimeUtility.Now().ToString("dd -MM-yyyy HH:mm:ss")}', 105) > Convert(datetime, ses.SESSION_START_TIME, 105) and 

                                        Convert(datetime, '{DateTimeUtility.Now().ToString("dd-MM-yyyy HH:mm:ss")}', 105) < Convert(datetime, ses.SESSION_END_TIME, 105)
                                    )";

                List<IDictionary<string, object>> Result2 = await sqlFunction.ExecuteSqlQuery(query);

                if (Result.Count > 0 || Result2.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = new { queue = Result, session = Result2 } };
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

        public async Task<AddUpdateDelete> CheckOverlapingSlots(SchedularFormModel model)
        {
            try
            {
                string sqlQuery = $@"select distinct clr.formGroupKey, clr.[start], clr.[end],clr_ref.referrenceFormId,clr_ref.referrenceId from CALENDAR_FORM_1935 clr
                                     join form_calenderreferrence clr_ref on clr_ref.formgroupkey=clr.formGroupKey 
                                     where (cast([start] as date) >= '{model.SCH_FROM_DATE}' 
                                     and cast([end] as date) <= '{model.SCH_TO_DATE}') and (CALENDAR_CODE = '{model.CALENDAR_CODE}' and COMPANY_CODE = '{model.COMPANY_CODE}') 
                                     and (
                                            (referrenceFormId={(int)FormSetting.LOCATION_MASTER} and referrenceId={model.SCH_LOCATION}) OR 
                                            (referrenceFormId={(int)FormSetting.SERVICE_MASTER} and referrenceId={model.SCH_ACTIVITY}) OR 
                                            (referrenceFormId={(int)FormSetting.SERVICE_PROVIDER_MASTER} and referrenceId={model.SCH_RESOURCE})
                                         )";



                var slotsResult = await sqlFunction.ExecuteSqlQuery(sqlQuery);

                //slot filter with service same but location and service provider not same
                var location_slotsResult = slotsResult.Where(x => x["referrenceFormId"].ToString() == ((int)FormSetting.LOCATION_MASTER).ToString() && x["referrenceId"].ToString() == model.SCH_LOCATION.ToString()).ToList();
                var service_provider_slotsResult = slotsResult.Where(x => x["referrenceFormId"].ToString() == ((int)FormSetting.SERVICE_PROVIDER_MASTER).ToString() && x["referrenceId"].ToString() == model.SCH_RESOURCE.ToString()).ToList();


                slotsResult = (from locationSlot in location_slotsResult
                               join serviceProviderSlot in service_provider_slotsResult
                               on locationSlot["formGroupKey"] equals serviceProviderSlot["formGroupKey"]
                               select locationSlot).ToList();


                bool finalStatus = false;

                if (slotsResult.Count > 0)
                {
                    var slotsResultModel = JsonConvert.DeserializeObject<List<CommonTimeObject>>(JsonConvert.SerializeObject(slotsResult));

                    slotsResultModel.ForEach(existingslot =>
                    {
                        string day = Convert.ToDateTime(existingslot.start).DayOfWeek.ToString().Substring(0, 3);

                        var scheduleData = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(model.table));

                        var scheduleSlots = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(JsonConvert.SerializeObject(scheduleData[day]));

                        scheduleSlots.ForEach(x =>
                        {
                            if (!string.IsNullOrEmpty(x["start"]?.ToString()) && !string.IsNullOrEmpty(x["start"]?.ToString()))
                            {
                                if (!TimeSlotCompare(JsonConvert.DeserializeObject<CommonTimeObject>(JsonConvert.SerializeObject(x)), existingslot) && x["IsOverlapped"].ToString().ToLower() == "false")
                                {
                                    x["IsOverlapped"] = "true";
                                    finalStatus = true;
                                }
                            }

                        });

                        scheduleData[day] = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(new { scheduleSlots }))["scheduleSlots"];
                        model.table = JsonConvert.DeserializeObject<SCHSCHEDULETABLE>(JsonConvert.SerializeObject(scheduleData));

                    });

                }

                return new AddUpdateDelete() { Status = finalStatus, Message = "success", Data = model };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> CheckRoomRentalOverlapingSlots(SchedularFormModel model)
        {
            try
            {
                string sqlQuery = $@"select distinct clr.formGroupKey, clr.[start], clr.[end],clr_ref.referrenceFormId,clr_ref.referrenceId from CALENDAR_FORM_1935 clr
                                     join form_calenderreferrence clr_ref on clr_ref.formgroupkey=clr.formGroupKey 
                                     where (
										(cast([start] as date) <= '{model.SCH_FROM_DATE}' and (cast([end] as date) <= '{model.SCH_TO_DATE}' and cast([end] as date) >= '{model.SCH_FROM_DATE}')) or
										((cast([start] as date) >= '{model.SCH_FROM_DATE}' and cast([start] as date) <= '{model.SCH_TO_DATE}') and (cast([end] as date) <= '{model.SCH_TO_DATE}' and cast([end] as date) >= '{model.SCH_FROM_DATE}')) or
										((cast([start] as date) <= '{model.SCH_TO_DATE}' and cast([start] as date) >= '{model.SCH_FROM_DATE}') and cast([end] as date) >= '{model.SCH_TO_DATE}') or
										(cast([start] as date) <= '{model.SCH_FROM_DATE}' and cast([end] as date) >= '{model.SCH_TO_DATE}')
									 )
									 and (CALENDAR_CODE = '{model.CALENDAR_CODE}' and COMPANY_CODE = '{model.COMPANY_CODE}') 
                                     and (
                                            (referrenceFormId={(int)FormSetting.LOCATION_MASTER} and referrenceId={model.SCH_RESOURCE})
                                         )
								 	 and clr.EVENT_TYPE = 'BOOKING'";

                var slotsResult = await sqlFunction.ExecuteSqlQuery(sqlQuery);

                if (slotsResult.Count > 0)
                {
                    return new AddUpdateDelete() { Status = false, Message = "Location already booked for selected date range", Data = model };
                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = "success", Data = model };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        private bool TimeSlotCompare(CommonTimeObject timeA, CommonTimeObject timeB)
        {
            bool testResult = true;

            timeA.start = Convert.ToDateTime(timeA.start).ToShortTimeString();
            timeA.end = Convert.ToDateTime(timeA.end).ToShortTimeString();

            timeB.start = Convert.ToDateTime(timeB.start).ToShortTimeString();
            timeB.end = Convert.ToDateTime(timeB.end).ToShortTimeString();

            // case 1
            if (Convert.ToDateTime(timeA.start) <= Convert.ToDateTime(timeB.start) && (Convert.ToDateTime(timeA.end) <= Convert.ToDateTime(timeB.end) && Convert.ToDateTime(timeA.end) >= Convert.ToDateTime(timeB.start)))
            {
                testResult = false;
            }

            // case 2
            if (Convert.ToDateTime(timeA.start) >= Convert.ToDateTime(timeB.start) && Convert.ToDateTime(timeA.end) <= Convert.ToDateTime(timeB.end))
            {
                testResult = false;
            }

            // case 3
            if ((Convert.ToDateTime(timeA.start) >= Convert.ToDateTime(timeB.start) && Convert.ToDateTime(timeA.start) <= Convert.ToDateTime(timeB.end)) && Convert.ToDateTime(timeA.end) >= Convert.ToDateTime(timeB.end))
            {
                testResult = false;
            }

            // case 4
            if (Convert.ToDateTime(timeA.start) <= Convert.ToDateTime(timeB.start) && Convert.ToDateTime(timeA.end) >= Convert.ToDateTime(timeB.end))
            {
                testResult = false;
            }

            return testResult;
        }

        public async Task<AddUpdateDelete> AddCalendarEventSlot(CalendarFormModel model, string formGroupKey)
        {
            model.allDay = "false";

            Form_DataTable data = new Form_DataTable();
            data.action = (int)FormAction.Save;
            data.formId = (int)FormSetting.CALENDAR_FORM;
            data.userId = (int)FormSetting.CreatedUser;
            data.created_by = (int)FormSetting.CreatedUser;
            data.updated_by = (int)FormSetting.CreatedUser;
            data.created_at = DateTimeUtility.Now().ToString();
            data.updated_at = DateTimeUtility.Now().ToString();
            data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
            data.formGroupKey = formGroupKey;

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

        public async Task<AddUpdateDelete> AddCalendarReference(CalendarReferenceModel model)
        {
            string query = $@"insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                              values('{model.formId}', '{model.formgroupkey}', '0', '{model.referrenceFormId}', '{model.referrenceId}', '{model.referrenceFormTable}', '{model.referrenceColumnName}', '{model.resourceFormId}', '{model.resourceId}', '{FormSetting.CreatedUser}', getDate(), '{FormSetting.CreatedUser}', getDate())";

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

        public async Task<AddUpdateDelete> UpdateTransactionAttendance(string TransactionId, bool IsPresent = false)
        {
            var attendance = (IsPresent) ? "PRESENT" : "ABSENT";
            string query = $@"update TRANSACTION_MASTER_1942 set ATTENDANCE='{attendance}' where Id='{TransactionId}'";

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

        public async Task<AddUpdateDelete> UpdateTransactionAttendance(List<BulkAttendanceModel> BulkAttendance, string userId)
        {
            try
            {
                var companies = await GetAllCompaniesByUserId(userId);

                List<BulkAttendanceModel> FinalAttendance = new List<BulkAttendanceModel>();

                // filter attendance data with companies

                for (int i = 0; i < companies.Data.Count; i++)
                {
                    for (int j = 0; j < BulkAttendance.Count; j++)
                    {
                        if (BulkAttendance[j].IsUpdated)
                        {
                            if (companies.Data[i]["COMPANY_CODE"].ToString() == BulkAttendance[j].CompanyCode.ToString())
                            {
                                FinalAttendance.Add(BulkAttendance[j]);
                            }
                        }

                    }
                }

                // create query for updating in db

                string query = "";

                for (int i = 0; i < FinalAttendance.Count; i++)
                {
                    var attendance = FinalAttendance[i].Attendance;
                    query += $@"update TRANSACTION_MASTER_1942 set ATTENDANCE='{attendance}' where Id='{FinalAttendance[i].Id}'";
                }

                int result = 0;

                if (!string.IsNullOrEmpty(query))
                {
                    result = await sqlFunction.ExecuteSqlCommandQuery(query);
                }

                if (result > 0)
                {
                    if (BulkAttendance.Count == FinalAttendance.Count)
                    {
                        return new AddUpdateDelete() { Status = true, Message = "All Records Updated Successfully" };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = "Records Updated Paritially" };
                    }

                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = "No Records Updated" };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }

        }

        public async Task<AddUpdateDelete> GetCalendarDetails(string calendarCode, string UserId = null)
        {
            try
            {
                string sqlString = "";

                if (string.IsNullOrEmpty(UserId))
                {
                    sqlString = $@"select *from BUSINESS_CALENDAR_MASTER_1925 where CALENDAR_CODE='{calendarCode ?? ""}'";
                }
                else
                {
                    sqlString = $@"select calendar.* from BUSINESS_ASSIGNED_USERS_1964 f
                                join USER_MASTER_1915 um on um.Id = f.ASSIGNED_USER
                                join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID
                                Join BUSINESS_CALENDAR_MASTER_1925 calendar on calendar.COMPANY_CODE = company.COMPANY_CODE
                                where um.Id = {UserId} and calendar.CALENDAR_CODE = '{calendarCode}'";
                }

                var result = (await sqlFunction.ExecuteSqlQuery(sqlString)).FirstOrDefault();
                if (result != null)
                {
                    string categoryId = result["CALENDAR_CATEGORY_ID"]?.ToString() ?? "";

                    sqlString = $@"select *from CALENDAR_CATEGORY_MASTER_1929 where Id = {categoryId}";

                    var category = (await sqlFunction.ExecuteSqlQuery(sqlString)).FirstOrDefault();
                    result.Add("category", category);

                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };

                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }

        }


        public async Task<AddUpdateDelete> GetServiceList(string calendarCode, string CompanyCode)
        {
            try
            {
                string sqlString = $@"select * from SERVICE_MASTER_1933  where CALENDAR_CODE='{calendarCode}' AND COMPANY_CODE='{CompanyCode}'";


                var result = (await sqlFunction.ExecuteSqlQuery(sqlString)).ToList();
                if (result != null)
                {

                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };

                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }

        }

        public async Task<AddUpdateDelete> GetCompanyServiceList(string CompanyCode)
        {
            try
            {
                //string sqlString = $@"select * from SERVICE_MASTER_1933  where  COMPANY_CODE='{CompanyCode}'";
                string sqlString = $@"select Id,ACTIVITY_NAME,DESCRIPTION,(select isnull(ROUND(AVG(REVIEW_SCORE), 2),0) from SESSION_REVIEWS_1983 where CALENDAR_CODE=sm.CALENDAR_CODE) as REVIEW_SCORE from SERVICE_MASTER_1933 sm  where COMPANY_CODE='{CompanyCode}'";
                var result = (await sqlFunction.ExecuteSqlQuery(sqlString)).ToList();
                if (result != null)
                {

                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };

                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }

        }


        public async Task<AddUpdateDelete> GetFeaturedBlogs()
        {
            try
            {
                string sqlString = $@"SELECT Id,BLOG_CATEGORY,BLOG_TITLE,IMAGE,BLOG_CONTENT,IS_HOT,TAG,created_at FROM BLOG_1980 WHERE IS_FEATURED='YES'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlString);

                if (result.Any())
                {
                    return new AddUpdateDelete { Data = result.ToList(), Message = AppMessage.Success, Status = true };
                }

                return new AddUpdateDelete { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete { Status = false, Message = AppMessage.NotFound };
            }
        }







        public async Task<AddUpdateDelete> GetBlogbyId(string Id)
        {
            try
            {
                string sqlString = $@"SELECT Id,BLOG_CATEGORY,BLOG_TITLE,IMAGE,BLOG_CONTENT,IS_HOT,TAG,created_at FROM BLOG_1980 WHERE Id='{Id}'";


                var result = (await sqlFunction.ExecuteSqlQuery(sqlString)).FirstOrDefault();
                if (result != null)
                {

                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };

                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }

        }



        public async Task<AddUpdateDelete> GetBlogs()
        {
            try
            {
                string sqlString = $@"SELECT Id,BLOG_CATEGORY,BLOG_TITLE,IMAGE,BLOG_CONTENT,MARKED_AS_HOT,TAG,created_at FROM BLOG_1980 WHERE MARKED_AS_HOT='NO'";

                var result = await sqlFunction.ExecuteSqlQuery(sqlString);

                if (result.Any())
                {
                    return new AddUpdateDelete { Data = result.ToList(), Message = AppMessage.Success, Status = true };
                }

                return new AddUpdateDelete { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete { Status = false, Message = AppMessage.NotFound };
            }
        }



        public async Task<Resultdata> GetAllBlogsTags()
        {
            try
            {
                string query = "SELECT TAG FROM BLOG_1980";


                using (var connection = new SqlConnection(connectionString))
                {
                    var result = await connection.QueryAsync<Tag>(query);
                    return new Resultdata { Status = true, Message = AppMessage.Success, Data = result.ToList() };
                }
            }
            catch (Exception ex)
            {
                return new Resultdata { Status = false, Message = AppMessage.NotFound };
            }

        }

        public async Task<AddUpdateDelete> getCalendarUploadFiles(int eventId)
        {
            try
            {
                string sqlString = $@"select *from CALENDAR_FORM_1935 where Id=" + eventId;


                var result = (await sqlFunction.ExecuteSqlQuery(sqlString)).FirstOrDefault();
                if (result != null)
                {

                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };

                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }
        public async Task<AddUpdateDelete> updateCalendarUploadFiles(int eventId, string downloadable_attachment, string download_file_list)
        {
            try
            {
                string sqlString = $@"update CALENDAR_FORM_1935 set DOWNLOAD_FILE_LIST=N'{SQLUtility.TreatSingleQuoteForQuery(download_file_list)}',DOWNLOADABLE_ATTACHMENT=N'{SQLUtility.TreatSingleQuoteForQuery(downloadable_attachment)}' where Id=" + eventId;


                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {

                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };

                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }



        public async Task<AddUpdateDelete> updateAssesstmentUploadFiles(int transactionId, string downloadable_attachment, string download_file_list)
        {
            try
            {
                string sqlString = $@"update TRANSACTION_MASTER_1942 set ASSESSMENT_FILES_LIST=N'{SQLUtility.TreatSingleQuoteForQuery(download_file_list)}',ASSESSMENT_FILES=N'{SQLUtility.TreatSingleQuoteForQuery(downloadable_attachment)}' where Id=" + transactionId;


                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {

                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };

                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> updateCalendarOtherField(int eventId, Dictionary<string, object> data)
        {
            try
            {
                string updateKeys = "";
                data.Keys.ToList().ForEach(key =>
                {
                    updateKeys += $" [{key}]=N'{SQLUtility.TreatSingleQuoteForQuery(data[key]?.ToString())}', ";
                });
                updateKeys = updateKeys.TrimEnd(", ".ToCharArray());
                string sqlString = $@"update CALENDAR_FORM_1935 set {updateKeys} where Id=" + eventId;


                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {
                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };
                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> updateSchedularCalendarOtherField(int schedularId, SchedularFormModel schedularForm)
        {
            try
            {
                string sqlString = $@"update CALENDAR_FORM_1935 set DOWNLOADABLE_ATTACHMENT=N'{SQLUtility.TreatSingleQuoteForQuery(schedularForm.DOWNLOADABLE_ATTACHMENT)}',
                                    DOWNLOAD_FILE_LIST=N'{SQLUtility.TreatSingleQuoteForQuery(schedularForm.DOWNLOAD_FILE_LIST)}',IS_UPLOAD_REQUIRED=N'{schedularForm.IS_UPLOAD_REQUIRED}',
                                    UPLOAD_TIME=N'{schedularForm.UPLOAD_TIME}' where SCHEDULAR_FORM_ID='{schedularId}'";


                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlString);
                if (result > 0)
                {
                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };
                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }


        public async Task<AddUpdateDelete> GetEnrollUserDetails(int eventId, string email)
        {

            string sqlString = $@"select clr.*,pr.STUDENT_NAME,pr.STUDENT_ID,pr.EMAIL,trm.ATTENDANCE,trm.ASSESSMENT_FILES,trm.ASSESSMENT_FILES_LIST,trm.ID TRANSACTION_ID
                                  from CALENDAR_FORM_1935 clr
                                  join TRANSACTION_MASTER_1942  trm on clr.formGroupKey=trm.formGroupKey
                                  join PARTICIPANT_MASTER_1940 pr on pr.Id=trm.STUDENT
                                  where clr.Id={eventId} and pr.EMAIL='{email}'";

            var result = await sqlFunction.ExecuteSqlQuery(sqlString);
            if (result.Count() > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

    }
}
