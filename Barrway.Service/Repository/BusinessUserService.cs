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

namespace Barrway.Service.Repository
{
    public class BusinessUserService : IBusinessUserService
    {
        private readonly string connectionString;
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;

        public BusinessUserService(IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction)
        {
            this.connectionString = ConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
        }

        public async Task<AddUpdateDelete> CreateBusinessWebsite(BusinessAccountWebsiteModel model)
        {
            Form_DataTable data = new Form_DataTable();
            data.action = (int)FormAction.Save;
            data.formId = (int)FormSetting.BUSINESS_ACCOUNT_WEBSITE;

            data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
            data.formGroupKey = Guid.NewGuid().ToString();
            var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (formResult.res == 1)
            {
                string BusinessCode = "BIZ" + formResult.Id.ToString().PadLeft(5, '0'); ;

                string sqlQuery = $@"update BUSINESS_ACCOUNT_WEBSITE_1918 set BUSINESS_CODE = '{BusinessCode}' where Id = {formResult.Id}";

                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlQuery);

                return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = formResult.Id.ToString() };
            }
            else
            {
                return new AddUpdateDelete() { Message = formResult.Message, Status = false };
            }
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
                

            }catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> UpdateAssignedCompany(List<UserAssignedCompanyModel> modelList)
        {
            try
            {

                string sqlQuery = $@"delete from USER_ASSIGNED_COMPANIES_1967 where ASSIGN_ID = '{modelList.FirstOrDefault().ASSIGN_ID}'";
                var result = await sqlFunction.ExecuteSqlCommandQuery(sqlQuery);

                List<string> requestList = new List<string>();
                List<string> formGroupKeyListTemp = new List<string>();

                modelList.ForEach(assign =>
                {
                    requestList.Add(CustomMethods.ConvertDicToNameValuePair(assign.ToDictionary()));
                    formGroupKeyListTemp.Add(Guid.NewGuid().ToString());
                });

                Form_DataTable request = new Form_DataTable();
                request.action = (int)FormAction.Save;
                request.formId = (int)FormSetting.USER_ASSIGNED_COMPANIES;
                request.IsMaxOneRecordPerUser = false;
                request.formfieldDataListTempList = requestList.ToArray();
                request.formGroupKeyListTemp = formGroupKeyListTemp.ToArray();
                var formResult = (await formAPIRepository.BulkGeneratedFormData(request)).Data;

                if (formResult.res == 1)
                {
                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = formResult.Id.ToString() };
                }
                else
                {
                    return new AddUpdateDelete() { Message = formResult.Message, Status = false };
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
            string query = "SELECT [Id]          ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[CURRENT_STEP]      ,[SUBSCRIPTION_PLAN_ID]      ,[USER_ID]      ,[COMPANY_CALENDAR_STATUS]      ,[COMPANY_PROFILE_STATUS]  FROM [dbo].[BUSINESS_ACCOUNT_WEBSITE_1918] where USER_ID = '" + UserId + "'";

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

        public async Task<AddUpdateDelete> GetSingleCompanyById(string Id)
        {
            string query = $@"SELECT company.[Id], city.CITY_NAME as 'COMPANY_CITY_NAME', district.DISTRICT_NAME as 'COMPANY_DISTRICT_NAME', country.COUNTRY_NAME as 'COMPANY_COUNTRY_NAME', category.COMPANY_CATEGORY_NAME, subCategory.COMPANY_SUB_CATEGORY_NAME      ,company.[created_at]      ,company.[updated_at]      ,company.[created_by]      ,company.[updated_by]     ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE],     [COMPANY_EMAIL]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE],     [COMPANY_EMAIL]      ,company.[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID]      ,company.[COUNTRY_ID]      ,company.[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT],[IS_ACTIVE]  
                                FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                join DISTRICT_MASTER_1928 district on district.Id = company.DISTRICT_ID
                                join CITY_MASTER_1927 city on city.Id = company.CITY_ID
                                join COUNTRY_MASTER_1926 country on country.Id = company.COUNTRY_ID
                                join COMPANY_CATEGORY_MASTER_1920 category on category.Id = company.COMPANY_CATEGORY_ID
                                join COMPANY_SUB_CATEGORY_MASTER_1921 subCategory on subCategory.Id = company.COMPANY_SUB_CATEGORY_ID
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

            string query6 = $@"select case when bau.ROLE_TYPE = 'SUPERUSER' then (select COUNT(assigned_m.Id) from BUSINESS_ASSIGNED_USERS_1964 assigned_m where BUSINESS_ACCOUNT_ID = '') else 0 end as 'Admins'  from USER_MASTER_1915 user_m
                                    join BUSINESS_ACCOUNT_WEBSITE_1918 baw on baw.USER_ID = user_m.USER_ID
                                    join BUSINESS_ASSIGNED_USERS_1964 bau on bau.BUSINESS_ACCOUNT_ID = baw.Id
                                    join ROLE_MASTER_1917 user_role on user_role.Id = user_m.ROLE_ID
                                    where user_m.Id = '{UserId}' and user_m.ROLE_ID = '1' and bau.ASSIGNED_USER = user_m.Id";

            List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);
            List<IDictionary<string, object>> result2 = await sqlFunction.ExecuteSqlQuery(query2);
            List<IDictionary<string, object>> result3 = await sqlFunction.ExecuteSqlQuery(query3);
            List<IDictionary<string, object>> result4 = await sqlFunction.ExecuteSqlQuery(query4);
            List<IDictionary<string, object>> result5 = await sqlFunction.ExecuteSqlQuery(query5);
            List<IDictionary<string, object>> result6 = await sqlFunction.ExecuteSqlQuery(query6);

            List<IDictionary<string, object>> finalList = new List<IDictionary<string, object>>();

            finalList.Add(result[0]);
            finalList.Add(result2[0]);
            finalList.Add(result3[0]);
            finalList.Add(result4[0]);
            finalList.Add(result5[0]);
            finalList.Add(result6[0]);

            return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = finalList };
        }

        public async Task<AddUpdateDelete> getAllAssignedCompanies(string AssignedId, string UserId)
        {
            string query = $@"declare @bstAccount varchar(max)
                                set @bstAccount = stuff((select ',' + BUSINESS_ACCOUNT_ID from BUSINESS_ASSIGNED_USERS_1964 f where f.ASSIGNED_USER = '{UserId}' and ROLE_TYPE = 'SUPERUSER' for xml path('')), 1, 1, '')

                                select case when (uac.COMPANY_ID is null) then 'N' else 'Y' end as 'IS_ASSIGNED', company.* from 
                                BUSINESS_COMPANY_MASTER_1924 company
                                left join (select * from USER_ASSIGNED_COMPANIES_1967 where ASSIGN_ID = '{AssignedId}') uac on uac.COMPANY_ID = company.Id
                                where company.BUSINESS_ACCOUNT_ID in (select cast(item as integer) from dbo.SplitString(@bstAccount, ','))
                                ";
            List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

            return new AddUpdateDelete() { Status = true, Data = result, Message = AppMessage.Success };
        }

        public async Task<AddUpdateDelete> getCompanyCalendarDashboardData(string CompanyCode, string CalendarCode)
        {
            string query1 = $@"select COUNT(*) as 'BookingsToday' from TRANSACTION_MASTER_1942 where COMPANY_CODE = '{CompanyCode}' and (created_at < getDate() and created_at > DATEADD(d,0,DATEDIFF(d,0,GETDATE())))";

            string query2 = $@"select COUNT(*) as 'BookingsThisWeek' from TRANSACTION_MASTER_1942 where COMPANY_CODE = '{CompanyCode}' 
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
            string query = $@"select f.* 
                            from BUSINESS_COMPANY_MASTER_1924 f
                            join USER_ASSIGNED_COMPANIES_1967 uac on uac.COMPANY_ID = f.Id
                            join BUSINESS_ASSIGNED_USERS_1964 bau on bau.Id = uac.ASSIGN_ID
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
                    { "COMPANY_CATEGORY_NAME","company.COMPANY_CATEGORY_NAME"},
                    { "COMPANY_SUB_CATEGORY_NAME","company.COMPANY_SUB_CATEGORY_NAME"},
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
                                    select (case when (bau.ROLE_TYPE='SUPERUSER') then 'Y' else 'N' end) as 'IS_EDITABLE'
                                    ,baw.BUSINESS_CODE, company.* 
                                    from BUSINESS_COMPANY_MASTER_1924 company
                                    join USER_ASSIGNED_COMPANIES_1967 uac on uac.COMPANY_ID = company.Id
                                    join BUSINESS_ASSIGNED_USERS_1964 bau on bau.Id = uac.ASSIGN_ID
									join BUSINESS_ACCOUNT_WEBSITE_1918 baw on baw.Id = bau.BUSINESS_ACCOUNT_ID
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

        public async Task<AddUpdateDelete> GetAllBusinessAssignedUsers(GenerateDynamicFormData data, string UserId)
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
                                declare @Ids varchar(max)
                                set @Ids = (select stuff((select ',' + BUSINESS_ACCOUNT_ID from BUSINESS_ASSIGNED_USERS_1964 where ASSIGNED_USER = (select Id from USER_MASTER_1915 where USER_ID = '{UserId}') and ROLE_TYPE = 'SUPERUSER' for xml path('')), 1, 1, ''));
                                with formdata as (
                                    select account.BUSINESS_CODE, user_m.USER_EMAIL, user_m.USER_ID, f.* 
                                    from BUSINESS_ASSIGNED_USERS_1964 f
                                    join USER_MASTER_1915 user_m on user_m.Id = f.ASSIGNED_USER
                                    Join BUSINESS_ACCOUNT_WEBSITE_1918 account on account.Id = f.BUSINESS_ACCOUNT_ID
                                    where f.BUSINESS_ACCOUNT_ID in (select cast(item as integer) from dbo.SplitString(@Ids,',')) {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
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
            string query = $@"select calendar.*, (select count(*) from LOCATION_MASTER_1936 where CALENDAR_CODE = calendar.CALENDAR_CODE) 'TOTAL_LOCATIONS', (select count(*) from SERVICE_MASTER_1933 where CALENDAR_CODE = calendar.CALENDAR_CODE) 'TOTAL_SERVICES', (select count(*) from SERVICE_PROVIDER_MASTER_1934 where CALENDAR_CODE = calendar.CALENDAR_CODE) 'TOTAL_SERVICE_PROVIDERS', (select count(*) from SCHEDULAR_FORM_1941 where CALENDAR_CODE = calendar.CALENDAR_CODE) 'TOTAL_SCHEDULARS', subCategory.CALENDAR_SUB_CATEGORY_NAME from BUSINESS_CALENDAR_MASTER_1925 calendar 
                                join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
                                join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendar.CALENDAR_SUB_CATEGORY_ID
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

        public async Task<AddUpdateDelete> GetCompanyCalendarByCompanyId(string CompanyId)
        {
            string query = $@"SELECT calendar.[Id]      ,calendar.[created_at], company.IS_ACTIVE      ,calendar.[updated_at]      ,calendar.[created_by]      ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,[CALENDAR_CATEGORY_ID]      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                where company.IS_ACTIVE = 'Y' and company.Id = '{CompanyId}'";

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

        public async Task<AddUpdateDelete> GetMarcketPlaceCompanyCalendarByCompanyId(string CompanyId)
        {
            string query = $@"SELECT calendar.[Id]      ,calendar.[created_at], company.IS_ACTIVE      ,calendar.[updated_at]      ,calendar.[created_by]      ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,[CALENDAR_CATEGORY_ID]      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                join CALENDAR_CATEGORY_MASTER_1929 category on category.Id = calendar.CALENDAR_CATEGORY_ID
                                where company.IS_ACTIVE = 'Y' and company.Id = '{CompanyId}' and category.[CALENDAR_FORM_TYPE]='PUBLIC'";

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
            string query = $@"SELECT [Id]
                                  ,[SUBSCRIPTION_PLAN_NAME]
                                  ,[SUBSCRIPTION_PLAN_PRICE]
                                  ,[SUBSCRIPTION_PLAN_VALIDITY]
                                  ,[VALIDITY_IN_MONTHS]
                                  ,[BOOKING_TRANSACTIONS]
                                  ,[SUBSCRIPTION_PLAN_HAS_VALIDITY]
                                  ,[IS_VISIBLE]
                                  ,[CALENDAR_AVAILABLE]
                                  ,[CLIENT_PACKAGE_AVAILABLE]
                                  ,[NO_OF_ADMIN]
                                  ,[PROMOTION_IN_MARKETPLACE]
                                  ,[CHAT_WITH_CLIENT]
                                  ,[CLIENT_PAYMENT]
                                  ,[PHOTO_ALBUM]
                                  ,[SUBSCRIPTION_PLAN_TYPE]
                                  ,[created_at]
                                  ,[updated_at]
                                  ,[created_by]
                                  ,[updated_by]
                              FROM [dbo].[SUBSCRIPTION_PLAN_MASTER_1919] where SUBSCRIPTION_PLAN_TYPE = 'BUSINESS' and IS_VISIBLE = 'Y'";

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

        public async Task<AddUpdateDelete> GetCompanyCalendars(GenerateDynamicFormData data, string CompanyId)
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

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    SELECT calendar.[Id], company.IS_ACTIVE      ,calendar.[created_at]      ,calendar.[updated_at]      ,calendar.[created_by], company.[COMPANY_NAME_ENGLISH] , company.Id as 'COMPANY_ID'     ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,calendar.[CALENDAR_CATEGORY_ID], category.CALENDAR_CATEGORY_NAME, subCategory.CALENDAR_SUB_CATEGORY_NAME      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                    join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                    join CALENDAR_CATEGORY_MASTER_1929 category on category.Id = calendar.CALENDAR_CATEGORY_ID
									join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendar.CALENDAR_SUB_CATEGORY_ID
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

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    SELECT calendar.[Id], company.IS_ACTIVE      ,calendar.[created_at]      ,calendar.[updated_at]      ,calendar.[created_by], company.[COMPANY_NAME_ENGLISH] , company.Id as 'COMPANY_ID'     ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,calendar.[CALENDAR_CATEGORY_ID], category.CALENDAR_CATEGORY_NAME, subCategory.CALENDAR_SUB_CATEGORY_NAME      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                    join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                    join CALENDAR_CATEGORY_MASTER_1929 category on category.Id = calendar.CALENDAR_CATEGORY_ID
									join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendar.CALENDAR_SUB_CATEGORY_ID
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
                    { "BOOKING_DATE","company.BOOKING_DATE"},
                    { "SERVICE_NAME","company.SERVICE_NAME"},
                    { "SERVICE_PROVIDER","calendar.SERVICE_PROVIDER"},
                    { "CLIENT_NAME","category.CLIENT_NAME"},
                    { "FROM_TIME","calendar.FROM_TIME"},
                    { "TO_TIME","calendar.TO_TIME"},
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

            string applyFilterQuery = string.Join(" and ", applyFilter);
            applyFilterQuery = applyFilterQuery.TrimEnd("and ".ToCharArray());

            int PageSize = data.size > 0 ? data.size : 20;
            int PageNumber = data.page > 0 ? data.page : 1;

            string sqlQuery = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                    SELECT [Id]
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
                                          ,[TO_TIME]
                                      FROM [dbo].[COMPANY_UPCOMING_BOOKINGS_1945] booking where COMPANY_CODE = '{CompanyCode}' and CALENDAR_CODE = '{CalendarCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
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

        public async Task<AddUpdateDelete> GetSchedule(string ScheduleId, string UserId)
        {
            string sqlQuery = $@"SELECT schedular.[Id]
                                      ,schedular.[created_at]
                                      ,schedular.[updated_at]
                                      ,schedular.[created_by]
                                      ,schedular.[updated_by]
                                      ,[SCH__NAME]
                                      ,[SCH_LOCATION]
                                      ,[SCH_ACTIVITY]
                                      ,[SCH_RESOURCE]
                                      ,[SCH_MEDIUM]
                                      ,[SCH_DESCRIPTION]
                                      ,[SCH_FROM_DATE]
                                      ,[SCH_TO_DATE]
                                      ,[SCH_ALTERNATIVE_WEEK]
                                      ,[hidden_1683715521753]
                                      ,[hidden_1683715524413]
                                      ,[SCH_START]
                                      ,[SCH_END]
                                      ,[SCH_COLOR]
                                      ,[SCH_ALL_DAY]
                                      ,[IF_SLOT_EXIST]
                                      ,[IF_SLOT_DOES_NOT_EXIST]
                                      ,[SCH_STUDENT_TABLE]
                                      ,[SCH_SCHEDULE_TABLE]
                                      ,schedular.[COMPANY_CODE]
                                      ,schedular.[CALENDAR_CODE]
                                  FROM [dbo].[SCHEDULAR_FORM_1941] schedular
								  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = schedular.COMPANY_CODE
								  join BUSINESS_ACCOUNT_WEBSITE_1918 b_account on b_account.Id = company.BUSINESS_ACCOUNT_ID
                                  where schedular.Id = '{ScheduleId}' and b_account.USER_ID = '{UserId}'";

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

        public async Task<AddUpdateDelete> GetDefaultCompanyByBusinessId(string BusinessAccountId, string UserId)
        {
            string query = $@"select f.* 
                                from BUSINESS_COMPANY_MASTER_1924 f
                                join USER_ASSIGNED_COMPANIES_1967 uac on uac.COMPANY_ID = f.Id
                                join BUSINESS_ASSIGNED_USERS_1964 bau on bau.Id = uac.ASSIGN_ID
                                where bau.BUSINESS_ACCOUNT_ID = '{BusinessAccountId}' and bau.ASSIGNED_USER = '{UserId}' and f.IS_DEFAULT = 'Y'";

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

        public async Task<AddUpdateDelete> GetDefaultCompanyByUserId(string UserId)
        {

            string query = $@"select f.* 
                                from BUSINESS_COMPANY_MASTER_1924 f
                                join USER_ASSIGNED_COMPANIES_1967 uac on uac.COMPANY_ID = f.Id
                                join BUSINESS_ASSIGNED_USERS_1964 bau on bau.Id = uac.ASSIGN_ID
                                join USER_MASTER_1915 um on um.Id = bau.ASSIGNED_USER
                                join BUSINESS_ACCOUNT_WEBSITE_1918 baw on baw.USER_ID = um.USER_ID
                                where um.Id = '{UserId}'and f.IS_DEFAULT = 'Y' and baw.Id = bau.BUSINESS_ACCOUNT_ID and f.IS_ACTIVE = 'Y'";


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
            string query = $@"SELECT company.[Id], company.[IS_TEMPLATE], category.COMPANY_CATEGORY_NAME as 'COMPANY_CATEGORY_NAME', subCategory.COMPANY_SUB_CATEGORY_NAME as 'COMPANY_SUB_CATEGORY_NAME', country.COUNTRY_NAME as 'COMPANY_COUNTRY_NAME', city.CITY_NAME as 'COMPANY_CITY_NAME', district.DISTRICT_NAME as 'COMPANY_DISTRICT_NAME'     ,company.[created_at]      ,company.[updated_at]      ,company.[created_by]      ,company.[updated_by]      ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,company.[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID],     [COMPANY_EMAIL]      ,company.[COUNTRY_ID]      ,company.[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT],[IS_ACTIVE]  
                                FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                join COMPANY_CATEGORY_MASTER_1920 category on category.Id = company.COMPANY_CATEGORY_ID
                                join COMPANY_SUB_CATEGORY_MASTER_1921 subCategory on subCategory.Id = company.COMPANY_SUB_CATEGORY_ID
                                join COUNTRY_MASTER_1926 country on country.Id = company.COUNTRY_ID
                                join CITY_MASTER_1927 city on city.Id = company.CITY_ID
                                join DISTRICT_MASTER_1928 district on district.Id = company.DISTRICT_ID
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
                        bool ActivateFreePlan = false;

                        if (website.Data["COMPANY_PROFILE_STATUS"].ToString() == "N")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set COMPANY_PROFILE_STATUS = 'Y', updated_at = '" + DateTime.Now.ToString() + "' where USER_ID = '" + UserName + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (website.Data["CURRENT_STEP"].ToString() != "COMPLETED")
                        {
                            if (website.Data["CURRENT_STEP"].ToString() == "COMPANY PROFILE")
                            {
                                query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'CALENDAR', updated_at = '" + DateTime.Now.ToString() + "'  where USER_ID = '" + UserName + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                            }
                            else if (website.Data["CURRENT_STEP"].ToString() == "COMPANY WEBSITE")
                            {
                                query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPLETED', updated_at = '" + DateTime.Now.ToString() + "'  where USER_ID = '" + UserName + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                                // registration and 3 steps are completed here and now activate free plan of user

                                if (saveResult > 0)
                                {
                                    ActivateFreePlan = true;
                                }

                            }
                        }
                        else
                        {
                            ActivateFreePlan = true;
                        }

                        if (ActivateFreePlan)
                        {
                            AddUpdateDelete freeSubscription = await GetCompanyFreeSubscriptionDetails(formResult.Id.ToString());

                            if (!freeSubscription.Status)
                            {
                                CompanySubscriptionDetailsModel companySubscriptionDetailsModel = new CompanySubscriptionDetailsModel()
                                {
                                    BOOKING_TRANSACTIONS = 500,
                                    CALENDAR_AVAILABLE = 1,
                                    CLIENT_PACKAGE_AVAILABLE = 1,
                                    NO_OF_ADMIN = 1,
                                    PHOTO_ALBUM = "N",
                                    CLIENT_PAYMENT = "N",
                                    CHAT_WITH_CLIENT = "N",
                                    PROMOTION_IN_MARKETPLACE = "N",
                                    COMPANY_ID = formResult.Id.ToString(),
                                    IS_FREE_PLAN = "Y",
                                    IS_ACTIVE = "Y",
                                    PURCHASE_DATE = DateTime.Now,
                                };
                                var subscriptionSaveResult = await AddCompanySubscriptionDetails(companySubscriptionDetailsModel);
                            }
                        }

                        string sqlQuery = $@"select * from BUSINESS_ASSIGNED_USERS_1964 where ASSIGN_ID = '{UserId}' and BUSINESS_ACCOUNT_ID = '{model.BUSINESS_ACCOUNT_ID}'";
                        var assignResult = await sqlFunction.ExecuteSqlQuery(sqlQuery);

                        if (assignResult.Count > 0)
                        {
                            UserAssignedCompanyModel userAssignedCompanyModel = new UserAssignedCompanyModel()
                            {
                                ASSIGN_ID = assignResult.FirstOrDefault()["Id"]?.ToString(),
                                COMPANY_ID = formResult.Id.ToString(),
                                STATUS = "ACTIVE"
                            };

                            var addAssignedCompanyResult = await UpdateAssignedCompany(new List<UserAssignedCompanyModel>()
                            {
                                userAssignedCompanyModel
                            });

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
                if (string.IsNullOrEmpty(model.IS_SEARCHABLE_IN_MARKETPLACE))
                {
                    model.IS_SEARCHABLE_IN_MARKETPLACE = "Y";
                }

                string LogoUpdateQuery = "";
                string BannerUpdateQuery = "";

                if (!string.IsNullOrEmpty(model.COMPANY_LOGO_PATH))
                {
                    LogoUpdateQuery = $@",[COMPANY_LOGO_NAME] = '{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_LOGO_NAME)}'
                                            ,[COMPANY_LOGO_PATH] = '{model.COMPANY_LOGO_PATH}'";
                }

                if (!string.IsNullOrEmpty(model.COMPANY_BANNER_PATH))
                {
                    BannerUpdateQuery = $@",[COMPANY_BANNER_NAME] = '{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_BANNER_NAME)}'
                                            ,[COMPANY_BANNER_PATH] = '{model.COMPANY_BANNER_PATH}'";
                }

                string query = $@"UPDATE [dbo].[BUSINESS_COMPANY_MASTER_1924] SET 
                               [updated_at] = getdate()
                              ,[BUSINESS_ACCOUNT_ID] = '{model.BUSINESS_ACCOUNT_ID}'
                              ,[COMPANY_NAME_ENGLISH] = '{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_NAME_ENGLISH)}'
                              ,[COMPANY_NAME_CHINESE] = N'{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_NAME_CHINESE)}'
                              {LogoUpdateQuery}
                              {BannerUpdateQuery}
                              ,[COMPANY_PHONE] = '{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_PHONE)}'
                              ,[COMPANY_ADDRESS] = '{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_ADDRESS)}'
                              ,[FACEBOOK_URL] = '{SQLUtility.TreatSingleQuoteForQuery(model.FACEBOOK_URL)}'
                              ,[INSTAGRAM_URL] = '{SQLUtility.TreatSingleQuoteForQuery(model.INSTAGRAM_URL)}'
                              ,[WECHAT_URL] = '{SQLUtility.TreatSingleQuoteForQuery(model.WECHAT_URL)}'
                              ,[TWITTER_URL] = '{SQLUtility.TreatSingleQuoteForQuery(model.TWITTER_URL)}'
                              ,[PAGE_URL] = '{SQLUtility.TreatSingleQuoteForQuery(model.PAGE_URL)}'
                              ,[COMPANY_DESCRIPTION] = '{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_DESCRIPTION)}'
                              ,[TAGS] = '{SQLUtility.TreatSingleQuoteForQuery(model.TAGS)}'
                              ,[IS_SEARCHABLE_IN_MARKETPLACE] = '{model.IS_SEARCHABLE_IN_MARKETPLACE}'
                              ,[COMPANY_CATEGORY_ID] = '{model.COMPANY_CATEGORY_ID}'
                              ,[COMPANY_SUB_CATEGORY_ID] = '{model.COMPANY_SUB_CATEGORY_ID}'
                              ,[COUNTRY_ID] = '{model.COUNTRY_ID}'
                              ,[CITY_ID] = '{model.CITY_ID}'
                              ,[DISTRICT_ID] = '{model.DISTRICT_ID}'
                              WHERE Id = '{model.Id}'";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (saveResult > 0)
                {
                    var website = await GetSingleBusinessWebsite(UserName);

                    if (website.Status)
                    {
                        if (website.Data["COMPANY_PROFILE_STATUS"].ToString() == "N")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set COMPANY_PROFILE_STATUS = 'Y', updated_at = getdate() where USER_ID = '" + UserName + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }


                        if (website.Data["CURRENT_STEP"].ToString() != "COMPLETED")
                        {
                            if (website.Data["CURRENT_STEP"].ToString() == "COMPANY PROFILE")
                            {
                                query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'CALENDAR', updated_at = getdate()  where USER_ID = '" + UserName + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                            }
                            else if (website.Data["CURRENT_STEP"].ToString() == "COMPANY WEBSITE")
                            {
                                query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPLETED', updated_at = getdate()  where USER_ID = '" + UserName + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                            }
                        }

                        AddUpdateDelete freeSubscription = await GetCompanyFreeSubscriptionDetails(CompanyDetails.Data["Id"].ToString());

                        if (!freeSubscription.Status)
                        {
                            CompanySubscriptionDetailsModel companySubscriptionDetailsModel = new CompanySubscriptionDetailsModel()
                            {
                                BOOKING_TRANSACTIONS = 500,
                                CALENDAR_AVAILABLE = 1,
                                CLIENT_PACKAGE_AVAILABLE = 1,
                                NO_OF_ADMIN = 1,
                                PHOTO_ALBUM = "N",
                                CLIENT_PAYMENT = "N",
                                CHAT_WITH_CLIENT = "N",
                                PROMOTION_IN_MARKETPLACE = "N",
                                COMPANY_ID = CompanyDetails.Data["Id"].ToString(),
                                IS_FREE_PLAN = "Y",
                                IS_ACTIVE = "Y",
                                PURCHASE_DATE = DateTime.Now,
                            };
                            var subscriptionSaveResult = await AddCompanySubscriptionDetails(companySubscriptionDetailsModel);
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

            string query = $@"UPDATE BUSINESS_COMPANY_MASTER_1924 SET COMPANY_SERVICE = '{model.COMPANY_SERVICE}' WHERE Id = '{model.Id}'";

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

        public async Task<AddUpdateDelete> AddCalendar(BusinessCalendarModel model, string UserId, CalendarControlModel calendarControlModel)
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
                                 WHERE Id = '{formResult.Id.ToString()}'";

                    int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                    // calendar created sucessfully now adding template items
                    if (!string.IsNullOrEmpty(model.CALENDAR_TEMPLATE_ID))
                    {
                        if (Convert.ToInt32(model.CALENDAR_TEMPLATE_ID) > 0)
                        {
                            // calendar is created using a template
                            // adding service master, serivce provider master and location master of template to the calendar

                            var ResourceId = "";
                            var CurrentResourceId = "";
                            var ActivityId = "";
                            var CurrentActivityId = "";
                            var LocationId = "";
                            var CurrentLocationId = "";

                            var currentTemplate = (await getSingleTemplate(model.CALENDAR_TEMPLATE_ID)).Data as List<IDictionary<string, object>>;

                            if (!string.IsNullOrEmpty(model.SCHEDULAR_ID))
                            {
                                if (Convert.ToInt32(model.SCHEDULAR_ID) > 0)
                                {
                                    GenerateDynamicFormData SchedularRequest = new GenerateDynamicFormData()
                                    {
                                        action = 32,
                                        formId = (int)FormSetting.SCHEDULAR_FORM
                                    };
                                    var SchedularData = (await formAPIRepository.GetFormRecordList(SchedularRequest)).Data;

                                    var template = new Dictionary<string, object>();

                                    foreach (var item in SchedularData.data)
                                    {
                                        if (item["Id"].ToString() == model.SCHEDULAR_ID)
                                        {
                                            template = item as Dictionary<string, object>;
                                            break;
                                        }
                                    }

                                    CurrentLocationId = template["SCH_LOCATION_Id"]?.ToString();
                                    CurrentActivityId = template["SCH_ACTIVITY_Id"]?.ToString();
                                    CurrentResourceId = template["SCH_RESOURCE_Id"]?.ToString();
                                }
                            }
                            

                            // adding location items
                            GenerateDynamicFormData LocationRequest = new GenerateDynamicFormData()
                            {
                                action = 32,
                                formId = (int)FormSetting.LOCATION_MASTER,
                                filter = new FilterDTO() { field = "CALENDAR_CODE", type = "=", value = currentTemplate[0]["CALENDAR_CODE"]?.ToString() }
                            };
                            var LocationData = (await formAPIRepository.GetFormRecordList(LocationRequest)).Data;


                            foreach (var template in LocationData.data)
                            {
                                var excludeColumns = AppSettings.exclude_columns_but_id;
                                IDictionary<string, object> temp = new Dictionary<string, object>();
                                foreach (var key in template.Keys)
                                {
                                    if (!excludeColumns.Any(x => x == key))
                                    {
                                        temp[key] = template[key];
                                    }
                                }
                                temp.Remove("COMPANY_CODE");
                                temp.Remove("CALENDAR_CODE");
                                temp.Remove("LOCATION_CODE");

                                temp.Add("COMPANY_CODE", model.COMPANY_CODE);
                                temp.Add("CALENDAR_CODE", model.CALENDAR_CODE);

                                data = new Form_DataTable();
                                data.action = (int)FormAction.Save;
                                data.formId = (int)FormSetting.LOCATION_MASTER;

                                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(temp);
                                data.formGroupKey = Guid.NewGuid().ToString();
                                var locationResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                                if (locationResult.res == 1)
                                {
                                    if (temp["Id"]?.ToString() == CurrentLocationId)
                                    {
                                        LocationId = locationResult.Id.ToString();
                                    }

                                    string tempCode = "LC" + locationResult.Id.ToString().PadLeft(5, '0');
                                    query = $@"UPDATE [dbo].[LOCATION_MASTER_1936]
                                               SET [LOCATION_CODE] = '{tempCode}'
                                               WHERE Id = '{locationResult.Id.ToString()}'";

                                    saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                                }

                            }


                            // adding service items
                            GenerateDynamicFormData serviceRequest = new GenerateDynamicFormData()
                            {
                                action = 32,
                                formId = (int)FormSetting.SERVICE_MASTER,
                                filter = new FilterDTO() { field = "CALENDAR_CODE", type = "=", value = currentTemplate[0]["CALENDAR_CODE"]?.ToString() }
                            };
                            var serviceData = (await formAPIRepository.GetFormRecordList(serviceRequest)).Data;


                            foreach (var template in serviceData.data)
                            {
                                var excludeColumns = AppSettings.exclude_columns_but_id;
                                IDictionary<string, object> temp = new Dictionary<string, object>();
                                foreach (var key in template.Keys)
                                {
                                    if (!excludeColumns.Any(x => x == key))
                                    {
                                        temp[key] = template[key];
                                    }
                                }
                                temp.Remove("COMPANY_CODE");
                                temp.Remove("CALENDAR_CODE");
                                temp.Remove("ACTIVITY_CODE");

                                temp.Add("COMPANY_CODE", model.COMPANY_CODE);
                                temp.Add("CALENDAR_CODE", model.CALENDAR_CODE);

                                data = new Form_DataTable();
                                data.action = (int)FormAction.Save;
                                data.formId = (int)FormSetting.SERVICE_MASTER;

                                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(temp);
                                data.formGroupKey = Guid.NewGuid().ToString();
                                var ActivityResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                                if (ActivityResult.res == 1)
                                {
                                    if (temp["Id"]?.ToString() == CurrentActivityId)
                                    {
                                        ActivityId = ActivityResult.Id.ToString();
                                    }

                                    string tempCode = "AC" + ActivityResult.Id.ToString().PadLeft(5, '0');
                                    query = $@"UPDATE [dbo].[SERVICE_MASTER_1933]
                                               SET [ACTIVITY_CODE] = '{tempCode}'
                                               WHERE Id = '{ActivityResult.Id.ToString()}'";

                                    saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                                }

                            }


                            // adding service provider items
                            GenerateDynamicFormData serviceProviderRequest = new GenerateDynamicFormData()
                            {
                                action = 32,
                                formId = (int)FormSetting.SERVICE_PROVIDER_MASTER,
                                filter = new FilterDTO() { field = "CALENDAR_CODE", type = "=", value = currentTemplate[0]["CALENDAR_CODE"]?.ToString() }
                            };
                            var serviceProviderData = (await formAPIRepository.GetFormRecordList(serviceProviderRequest)).Data;


                            foreach (var template in serviceProviderData.data)
                            {
                                var excludeColumns = AppSettings.exclude_columns_but_id;
                                IDictionary<string, object> temp = new Dictionary<string, object>();
                                foreach (var key in template.Keys)
                                {
                                    if (!excludeColumns.Any(x => x == key))
                                    {
                                        temp[key] = template[key];
                                    }
                                }
                                temp.Remove("COMPANY_CODE");
                                temp.Remove("CALENDAR_CODE");
                                temp.Remove("RESOURCE_CODE");

                                temp.Add("COMPANY_CODE", model.COMPANY_CODE);
                                temp.Add("CALENDAR_CODE", model.CALENDAR_CODE);

                                data = new Form_DataTable();
                                data.action = (int)FormAction.Save;
                                data.formId = (int)FormSetting.SERVICE_PROVIDER_MASTER;

                                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(temp);
                                data.formGroupKey = Guid.NewGuid().ToString();
                                var ResourceResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                                if (ResourceResult.res == 1)
                                {
                                    if (temp["Id"]?.ToString() == CurrentResourceId)
                                    {
                                        ResourceId = ResourceResult.Id.ToString();
                                    }

                                    string tempCode = "RC" + ResourceResult.Id.ToString().PadLeft(5, '0');
                                    query = $@"UPDATE [dbo].[SERVICE_PROVIDER_MASTER_1934]
                                               SET [RESOURCE_CODE] = '{tempCode}'
                                               WHERE Id = '{ResourceResult.Id.ToString()}'";

                                    saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                                }

                            }


                            // adding Calendar Control Sheet items
                            GenerateDynamicFormData controlSheetRequest = new GenerateDynamicFormData()
                            {
                                action = 32,
                                formId = (int)FormSetting.CALENDAR_CONTROL_SHEET,
                                filter = new FilterDTO() { field = "CALENDAR_CODE", type = "=", value = currentTemplate[0]["CALENDAR_CODE"]?.ToString() }
                            };
                            var controlSheetData = (await formAPIRepository.GetFormRecordList(controlSheetRequest)).Data;


                            foreach (var template in controlSheetData.data)
                            {
                                var excludeColumns = AppSettings.exclude_columns;
                                IDictionary<string, object> temp = new Dictionary<string, object>();
                                foreach (var key in template.Keys)
                                {
                                    if (!excludeColumns.Any(x => x == key))
                                    {
                                        temp[key] = template[key];
                                    }
                                }
                                temp.Remove("COMPANY_CODE");
                                temp.Remove("CALENDAR_CODE");
                                temp.Remove("USER_ADMIN_GROUP_NAME");
                                temp.Remove("CALENDAR_GROUP_NAME");

                                temp.Add("COMPANY_CODE", model.COMPANY_CODE);
                                temp.Add("CALENDAR_CODE", model.CALENDAR_CODE);
                                temp.Add("USER_ADMIN_GROUP_NAME", model.COMPANY_CODE.ToString() + model.CALENDAR_CODE.ToString());
                                temp.Add("CALENDAR_GROUP_NAME", model.CALENDAR_CODE.ToString() + model.COMPANY_CODE.ToString());

                                data = new Form_DataTable();
                                data.action = (int)FormAction.Save;
                                data.formId = (int)FormSetting.CALENDAR_CONTROL_SHEET;

                                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(temp);
                                data.formGroupKey = Guid.NewGuid().ToString();
                                var locationResult = (await formAPIRepository.GeneratedFormData(data)).Data;


                            }



                            // check for schedular
                            if (!string.IsNullOrEmpty(model.SCHEDULAR_ID))
                            {
                                if (Convert.ToInt32(model.SCHEDULAR_ID) > 0)
                                {
                                    // adding service items
                                    GenerateDynamicFormData SchedularRequest = new GenerateDynamicFormData()
                                    {
                                        action = 32,
                                        formId = (int)FormSetting.SCHEDULAR_FORM
                                    };
                                    var SchedularData = (await formAPIRepository.GetFormRecordList(SchedularRequest)).Data;

                                    var template = new Dictionary<string, object>();

                                    foreach (var item in SchedularData.data)
                                    {
                                        if (item["Id"].ToString() == model.SCHEDULAR_ID)
                                        {
                                            template = item as Dictionary<string, object>;
                                        }
                                    }

                                    
                                    var excludeColumns = AppSettings.exclude_columns;
                                    IDictionary<string, object> temp = new Dictionary<string, object>();
                                    foreach (var key in template.Keys)
                                    {
                                        if (!excludeColumns.Any(x => x == key))
                                        {
                                            temp[key] = template[key];
                                        }
                                    }

                                    var dataTable = JsonConvert.DeserializeObject<SchedularFormModel>(JsonConvert.SerializeObject(template));
                                    dataTable.table = JsonConvert.DeserializeObject<SCHSCHEDULETABLE>(dataTable.SCH_SCHEDULE_TABLE);
                                    dataTable.SCH_LOCATION = LocationId;
                                    dataTable.SCH_ACTIVITY = ActivityId;
                                    dataTable.SCH_RESOURCE = ResourceId;
                                    dataTable.SCH_TO_DATE = DateTime.Now.AddDays(Convert.ToInt32(template["SCH_DAYS"]?.ToString())).ToString("yyyy-MM-dd");
                                    dataTable.SCH_FROM_DATE = DateTime.Now.ToString("yyyy-MM-dd");
                                    dataTable.Id = null;
                                    dataTable.COMPANY_CODE = model.COMPANY_CODE;
                                    dataTable.CALENDAR_CODE = model.CALENDAR_CODE;
                                    string script = "";
                                    string formGroupKey = CustomMethods.CreateUUID();

                                    var response = await AddSchedularForm(dataTable, formGroupKey);

                                    if (response.Status)
                                    {
                                        try
                                        {
                                            var start = DateTime.Now;

                                            var end = DateTime.Now.AddDays(Convert.ToInt32(template["SCH_DAYS"]?.ToString()));

                                            DateTime dateTracker = start;
                                            int slotCounter = 1;

                                            while (dateTracker <= end)
                                            {
                                                string SchedularFormId = response.Data.Id.ToString();
                                                DateTime SlotStartTime = DateTime.Now;
                                                DateTime SlotEndTime = DateTime.Now;

                                                switch (dateTracker.DayOfWeek.ToString())
                                                {
                                                    case "Monday":
                                                        if (string.IsNullOrEmpty(dataTable.table.Monday.Start) || string.IsNullOrEmpty(dataTable.table.Monday.End))
                                                        {
                                                            // if time is not mentioned then skip that day
                                                            dateTracker = dateTracker.AddDays(1);
                                                            continue;
                                                        }
                                                        else
                                                        {
                                                            SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Monday.Start.ToString());
                                                            SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Monday.End.ToString());
                                                        }

                                                        break;
                                                    case "Tuesday":

                                                        if (string.IsNullOrEmpty(dataTable.table.Tuesday.Start) || string.IsNullOrEmpty(dataTable.table.Tuesday.End))
                                                        {
                                                            // if time is not mentioned then skip that day
                                                            dateTracker = dateTracker.AddDays(1);
                                                            continue;
                                                        }
                                                        else
                                                        {
                                                            SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Tuesday.Start.ToString());
                                                            SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Tuesday.End.ToString());
                                                        }


                                                        break;
                                                    case "Wednesday":

                                                        if (string.IsNullOrEmpty(dataTable.table.Wednesday.Start) || string.IsNullOrEmpty(dataTable.table.Wednesday.End))
                                                        {
                                                            // if time is not mentioned then skip that day
                                                            dateTracker = dateTracker.AddDays(1);
                                                            continue;
                                                        }
                                                        else
                                                        {
                                                            SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Wednesday.Start.ToString());
                                                            SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Wednesday.End.ToString());
                                                        }

                                                        break;
                                                    case "Thursday":

                                                        if (string.IsNullOrEmpty(dataTable.table.Thursday.Start) || string.IsNullOrEmpty(dataTable.table.Thursday.End))
                                                        {
                                                            // if time is not mentioned then skip that day
                                                            dateTracker = dateTracker.AddDays(1);
                                                            continue;
                                                        }
                                                        else
                                                        {
                                                            SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Thursday.Start.ToString());
                                                            SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Thursday.End.ToString());
                                                        }

                                                        break;
                                                    case "Friday":

                                                        if (string.IsNullOrEmpty(dataTable.table.Friday.Start) || string.IsNullOrEmpty(dataTable.table.Friday.End))
                                                        {
                                                            // if time is not mentioned then skip that day
                                                            dateTracker = dateTracker.AddDays(1);
                                                            continue;
                                                        }
                                                        else
                                                        {
                                                            SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Friday.Start.ToString());
                                                            SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Friday.End.ToString());
                                                        }

                                                        break;
                                                    case "Saturday":

                                                        if (string.IsNullOrEmpty(dataTable.table.Saturday.Start) || string.IsNullOrEmpty(dataTable.table.Saturday.End))
                                                        {
                                                            // if time is not mentioned then skip that day
                                                            dateTracker = dateTracker.AddDays(1);
                                                            continue;
                                                        }
                                                        else
                                                        {
                                                            SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Saturday.Start.ToString());
                                                            SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Saturday.End.ToString());
                                                        }

                                                        break;
                                                    case "Sunday":

                                                        if (string.IsNullOrEmpty(dataTable.table.Sunday.Start) || string.IsNullOrEmpty(dataTable.table.Sunday.End))
                                                        {
                                                            // if time is not mentioned then skip that day
                                                            dateTracker = dateTracker.AddDays(1);
                                                            continue;
                                                        }
                                                        else
                                                        {
                                                            SlotStartTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Sunday.Start.ToString());
                                                            SlotEndTime = Convert.ToDateTime(dateTracker.ToShortDateString() + " " + dataTable.table.Sunday.End.ToString());
                                                        }

                                                        break;
                                                }

                                                if (dataTable.SCH_ALTERNATIVE_WEEK == "ALTERNATE-WEEK")
                                                {
                                                    var weekNum = ((int)dateTracker.DayOfWeek);

                                                    if (weekNum % 2 == 0)
                                                    {
                                                        dateTracker = dateTracker.AddDays(7);
                                                        continue;
                                                    }
                                                }
                                                else if (dataTable.SCH_ALTERNATIVE_WEEK == "EVERY-3-WEEK")
                                                {
                                                    var weekNum = 0;// GetWeekNumberOfMonth(start);
                                                    if (weekNum > 3)
                                                    {
                                                        dateTracker = dateTracker.AddDays((7 * 3));
                                                        continue;
                                                    }
                                                }
                                                else if (dataTable.SCH_ALTERNATIVE_WEEK == "EVERY-4-WEEK")
                                                {
                                                    var weekNum = 0;// GetWeekNumberOfMonth(start.AddDays(1));
                                                    if (weekNum > 4)
                                                    {
                                                        dateTracker = dateTracker.AddDays((7 * 4));
                                                        continue;
                                                    }
                                                }

                                                CalendarFormModel eventData = new CalendarFormModel()
                                                {
                                                    end = SlotEndTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                                    resources = dataTable.SCH_RESOURCE,
                                                    activities = dataTable.SCH_ACTIVITY,
                                                    start = SlotStartTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                                    title = "Slot " + slotCounter++
                                                };
                                                formGroupKey = Guid.NewGuid().ToString();

                                                script += $@"insert into CALENDAR_FORM_1935(
                                                               [SCHEDULAR_FORM_ID]
                                                              ,[formGroupKey]
                                                              ,[formID]
                                                              ,[userID]
                                                              ,[Current_Status]
                                                              ,[cycle]
                                                              ,[MasterFormID]
                                                              ,[MasterFormRow]
                                                              ,[formRecordOrder]
                                                              ,[formRecordStatus]
                                                              ,[COMPANY_CODE]
                                                              ,[CALENDAR_CODE]
                                                              ,[title]
                                                              ,[start]
                                                              ,[end]
                                                              ,[allDay]
                                                              ,[resources]
                                                              ,[activities]

                                                              ,[description]
                                                              ,[created_at], [updated_at],[EVENT_TYPE])
	                                                          values('{SchedularFormId}', '{formGroupKey}', {(int)FormSetting.CALENDAR_FORM}, 30314, '0', 0, 0, '0', (select (Max(formRecordOrder)+1) from CALENDAR_FORM_1935), '0', '{dataTable.COMPANY_CODE}', '{dataTable.CALENDAR_CODE}', 'Slot {slotCounter}', '{SlotStartTime.ToString("yyyy-MM-ddTHH:mm:ss")}', '{SlotEndTime.ToString("yyyy-MM-ddTHH:mm:ss")}', 'false', '{dataTable.SCH_RESOURCE}', '{dataTable.SCH_ACTIVITY}', '{dataTable.SCH_DESCRIPTION}', getDate(), getDate(),'SCHEDULE');
                                
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_PROVIDER_MASTER}, '{dataTable.SCH_RESOURCE}', 'SERVICE_PROVIDER_MASTER_1934', 'FIRST_NAME', {(int)FormSetting.CALENDAR_FORM}, '{dataTable.SCH_RESOURCE}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())

                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.SERVICE_MASTER}, '{dataTable.SCH_ACTIVITY}', 'SERVICE_MASTER_1933', 'ACTIVITY_NAME', {(int)FormSetting.CALENDAR_FORM}, '{dataTable.SCH_ACTIVITY}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())
                        
                                                            insert into form_calenderreferrence(formId, formgroupkey, currentFormType, referrenceFormId, referrenceId, referrenceFormTable, referrenceColumnName, resourceFormId, resourceId, created_by, created_at, updated_by, updated_at)
                                                            values({(int)FormSetting.CALENDAR_FORM}, '{formGroupKey}', 0, {(int)FormSetting.LOCATION_MASTER}, '{dataTable.SCH_LOCATION}', 'LOCATION_MASTER_1936', 'LOCATION_CODE', {(int)FormSetting.CALENDAR_FORM}, '{dataTable.SCH_LOCATION}', '{(int)FormSetting.CreatedUser}', getDate(), '{(int)FormSetting.CreatedUser}', getDate())

                                                ";

                                                dateTracker = dateTracker.AddDays(1);

                                            }
                                        }
                                        catch (Exception ex)
                                        {

                                        }
                                        

                                    }

                                    var count = await sqlFunction.ExecuteSqlCommandQuery(script);

                                }
                            }


                        }
                    }


                    var website = await GetSingleBusinessWebsite(UserId);

                    if (website.Status)
                    {
                        if (website.Data["COMPANY_CALENDAR_STATUS"].ToString() == "N")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set COMPANY_CALENDAR_STATUS = 'Y', updated_at = getdate() where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (website.Data["CURRENT_STEP"].ToString() == "CALENDAR")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPANY WEBSITE', updated_at = getdate()  where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }
                    }


                    // map data in model
                    calendarControlModel.CALENDAR_CODE = model.CALENDAR_CODE;
                    calendarControlModel.COMPANY_CODE = model.COMPANY_CODE;
                    calendarControlModel.USER_ADMIN_GROUP_NAME = model.COMPANY_CODE.ToString() + model.CALENDAR_CODE.ToString();
                    calendarControlModel.CALENDAR_GROUP_NAME = model.CALENDAR_CODE.ToString() + model.COMPANY_CODE.ToString();

                    data = new Form_DataTable();
                    data.action = (int)FormAction.Save;
                    data.formId = (int)FormSetting.CALENDAR_CONTROL_SHEET;
                    data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(calendarControlModel.ToDictionary());
                    data.formGroupKey = Guid.NewGuid().ToString();
                    formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = formResult.Id.ToString() };
                }
                else
                {
                    return new AddUpdateDelete() { Message = formResult.Message, Status = false };
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
                                      ,[CALENDAR_NAME] = '{SQLUtility.TreatSingleQuoteForQuery(model.CALENDAR_NAME)}'
                                       {CalendarPhotoQuery}
                                      ,[TAGS] = '{model.TAGS}'
                                      ,[IS_VISIBLE] = '{model.IS_VISIBLE}'
                                      ,[COUNTRY_ID] = '{model.COUNTRY_ID}'
                                      ,[CITY_ID] = '{model.CITY_ID}'
                                      ,[SLOT_DURATION_IN_MINS] = '{model.SLOT_DURATION_IN_MINS}'
                                      ,[DISTRICT_ID] = '{model.DISTRICT_ID}'
                                      ,[CALENDAR_CATEGORY_ID] = '{model.CALENDAR_CATEGORY_ID}'
                                      ,[CALENDAR_SUB_CATEGORY_ID] = '{model.CALENDAR_SUB_CATEGORY_ID}'
                                      ,[COMPANY_CODE] = '{SQLUtility.TreatSingleQuoteForQuery(model.COMPANY_CODE)}'
                                 WHERE Id = '{model.Id}'

                                 UPDATE [dbo].[CALENDAR_CONTROL_SHEET_1944]
                                   SET 
                                      [updated_at] = getdate()
                                      ,[DISPLAY_START_TIME] = '{calendarControlModel.DISPLAY_START_TIME}'
                                      ,[DISPLAY_END_TIME] = '{calendarControlModel.DISPLAY_END_TIME}'
                                      ,[USER_ADMIN_GROUP_NAME] = '{calendarControlModel.USER_ADMIN_GROUP_NAME}'
                                      ,[CALENDAR_GROUP_NAME] = '{calendarControlModel.CALENDAR_GROUP_NAME}'
                                      ,[CALENDAR_USE_TYPE] = '{calendarControlModel.CALENDAR_USE_TYPE}'
                                      ,[CALENDAR_FORM_NAME] = '{calendarControlModel.CALENDAR_FORM_NAME}'
                                      ,[THEME_SELECTION] = '{calendarControlModel.THEME_SELECTION}'
                                      ,[RESOURCE_FORM_YN] = '{calendarControlModel.RESOURCE_FORM_YN}'
                                      ,[RESOURCE_NAME] = '{calendarControlModel.RESOURCE_NAME}'
                                      ,[RESOURCE_FORM_CATEGORY] = '{calendarControlModel.RESOURCE_FORM_CATEGORY}'
                                      ,[RESOURCE_FORM_NAME] = '{calendarControlModel.RESOURCE_FORM_NAME}'
                                      ,[RESOURCE_ALLOW_OVERLAP_YN] = '{calendarControlModel.RESOURCE_ALLOW_OVERLAP_YN}'
                                      ,[HAS_ACTIVITIES_YN] = '{calendarControlModel.HAS_ACTIVITIES_YN}'
                                      ,[ACTIVITY_NAME] = '{calendarControlModel.ACTIVITY_NAME}'
                                      ,[ACTIVITY_FORM_CATEGORY] = '{calendarControlModel.ACTIVITY_FORM_CATEGORY}'
                                      ,[ACTIVITY_FORM_NAME] = '{calendarControlModel.ACTIVITY_FORM_NAME}'
                                      ,[ACTIVITY_ALLOW_OVERLAP_YN] = '{calendarControlModel.ACTIVITY_ALLOW_OVERLAP_YN}'
                                      ,[LOCATION_NAME] = '{calendarControlModel.LOCATION_NAME}'
                                      ,[LOCATION_FORM_CATEGORY] = '{calendarControlModel.LOCATION_FORM_CATEGORY}'
                                      ,[LOCATION_FORM_NAME] = '{calendarControlModel.LOCATION_FORM_NAME}'
                                      ,[LOCATION_ALLOW_OVERLAP_YN] = '{calendarControlModel.LOCATION_ALLOW_OVERLAP_YN}'
                                      ,[HAS_PARTICIPANT_FORM_YN] = '{calendarControlModel.HAS_PARTICIPANT_FORM_YN}'
                                      ,[PARTICIPANT_NAME] = '{calendarControlModel.PARTICIPANT_NAME}'
                                      ,[PARTICIPANT_FORM_NAME] = '{calendarControlModel.PARTICIPANT_FORM_NAME}'
                                      ,[PARTICIPANT_ALLOW_REPEAT_YN] = '{calendarControlModel.PARTICIPANT_ALLOW_REPEAT_YN}'
                                      ,[REQUIRE_REGISTRATION_YN] = '{calendarControlModel.REQUIRE_REGISTRATION_YN}'
                                      ,[HAS_EVALUATION_YN] = '{calendarControlModel.HAS_EVALUATION_YN}'
                                      ,[EVALUATION_NAME] = '{calendarControlModel.EVALUATION_NAME}'
                                      ,[EVALUATION_FORM_CATEGORY] = '{calendarControlModel.EVALUATION_FORM_CATEGORY}'
                                      ,[EVALUATION_FORM_NAME] = '{calendarControlModel.EVALUATION_FORM_NAME}'
                                      ,[HAS_ASSESSMENT_YN] = '{calendarControlModel.HAS_ASSESSMENT_YN}'
                                      ,[ASSESSMENT_NAME] = '{calendarControlModel.ASSESSMENT_NAME}'
                                      ,[ASSESSMENT_FORM_CATEGORY] = '{calendarControlModel.ASSESSMENT_FORM_CATEGORY}'
                                      ,[ASSESSMENT_FORM_NAME] = '{calendarControlModel.ASSESSMENT_FORM_NAME}'
                                      ,[CALENDAR_FORM_CATEGORY] = '{calendarControlModel.CALENDAR_FORM_CATEGORY}'
                                      ,[REGISTRATION_FORM_NAME] = '{calendarControlModel.REGISTRATION_FORM_NAME}'
                                      ,[REGISTRATION_FORM_CATEGORY] = '{calendarControlModel.REGISTRATION_FORM_CATEGORY}'
                                 WHERE CALENDAR_CODE = '{calendarControlModel.CALENDAR_CODE}' and COMPANY_CODE = '{model.COMPANY_CODE}'

";

                int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (saveResult > 0)
                {
                    var website = await GetSingleBusinessWebsite(UserId);

                    if (website.Status)
                    {
                        if (website.Data["COMPANY_CALENDAR_STATUS"].ToString() == "N")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set COMPANY_CALENDAR_STATUS = 'Y', updated_at = getdate() where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (website.Data["CURRENT_STEP"].ToString() == "CALENDAR")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPANY WEBSITE', updated_at = getdate()  where USER_ID = '" + UserId + "'";
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

            if (CompanyDetails.Status)
            {
                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.COMPANY_SUBSCRIPTION_DETAILS;

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
            else
            {
                return new AddUpdateDelete() { Message = AppMessage.NotFound, Status = false };
            }
        }

        public async Task<AddUpdateDelete> GetCompanyFreeSubscriptionDetails(string CompanyId)
        {
            string query = $@"SELECT [Id]
                              ,[created_at]
                              ,[updated_at]
                              ,[created_by]
                              ,[updated_by]
                              ,[CALENDAR_AVAILABLE]
                              ,[CLIENT_PACKAGE_AVAILABLE]
                              ,[NO_OF_ADMIN]
                              ,[PHOTO_ALBUM]
                              ,[CLIENT_PAYMENT]
                              ,[PROMOTION_IN_MARKETPLACE]
                              ,[CHAT_WITH_CLIENT]
                              ,[PURCHASE_DATE]
                              ,[PAYMENT_ID]
                              ,[ORDER_ID]
                              ,[PAYMENT_METHOD]
                              ,[PAYMENT_STATUS]
                              ,[IS_ACTIVE]
                              ,[IS_FREE_PLAN]
                              ,[PLAN_ID]
                              ,[COMPANY_ID]
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

        public async Task<AddUpdateDelete> GetCompanyActiveSubscriptionDetails(string CompanyId)
        {
            string query = $@"SELECT [Id]
                              ,[created_at]
                              ,[updated_at]
                              ,[created_by]
                              ,[updated_by]
                              ,[CALENDAR_AVAILABLE]
                              ,[BOOKING_TRANSACTIONS]
                              ,[CLIENT_PACKAGE_AVAILABLE]
                              ,[NO_OF_ADMIN]
                              ,[PHOTO_ALBUM]
                              ,[CLIENT_PAYMENT]
                              ,[PROMOTION_IN_MARKETPLACE]
                              ,[CHAT_WITH_CLIENT]
                              ,[PURCHASE_DATE]
                              ,[PAYMENT_ID]
                              ,[ORDER_ID]
                              ,[PAYMENT_METHOD]
                              ,[PAYMENT_STATUS]
                              ,[IS_ACTIVE]
                              ,[IS_FREE_PLAN]
                              ,[PLAN_ID]
                              ,[COMPANY_ID]
                          FROM [dbo].[COMPANY_SUBSCRIPTION_DETAILS_1939] WHERE COMPANY_ID = '{CompanyId}' and IS_ACTIVE = 'Y' order by created_at desc";

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

        public async Task<AddUpdateDelete> GetCompanyPaymentHistory(GenerateDynamicFormData data, string CompanyId)
        {
            Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "ORDER_ID","history.ORDER_ID"},
                    { "SUBSCRIPTION_PLAN_NAME","subscriptionPlan.SUBSCRIPTION_PLAN_NAME"},
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
	                                      ,subscriptionPlan.SUBSCRIPTION_PLAN_NAME
                                          ,[PAYMENT_DESCRIPTION]
                                          ,[PAYMENT_METHOD]
                                          ,[HKD]
                                          ,[PAYMENT_DATE]
                                          ,[PAYMENT_STATUS]
                                          ,[COMPANY_ID]
                                      FROM [dbo].[COMPANY_PAYMENT_HISTORY_MASTER_1937] history
                                      join BUSINESS_COMPANY_MASTER_1924 company on company.Id = history.COMPANY_ID
                                      join SUBSCRIPTION_PLAN_MASTER_1919 subscriptionPlan on subscriptionPlan.Id = history.PLAN_ID
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
                data.created_at = DateTime.Now.ToString();
                data.updated_at = DateTime.Now.ToString();
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
                                          ,[SCH__NAME] = '{model.SCH__NAME}'
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

        public async Task<AddUpdateDelete> AddCalendarEventSlot(CalendarFormModel model, string formGroupKey)
        {
            model.allDay = "false";

            Form_DataTable data = new Form_DataTable();
            data.action = (int)FormAction.Save;
            data.formId = (int)FormSetting.CALENDAR_FORM;
            data.userId = (int)FormSetting.CreatedUser;
            data.created_by = (int)FormSetting.CreatedUser;
            data.updated_by = (int)FormSetting.CreatedUser;
            data.created_at = DateTime.Now.ToString();
            data.updated_at = DateTime.Now.ToString();
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
            var attendance = (IsPresent) ? "Yes" : "No";
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
                    var attendance = (FinalAttendance[i].Attendance == "Present") ? "Yes" : (FinalAttendance[i].Attendance == "Absent") ? "No" : "NOT-MARKED";
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

        public async Task<AddUpdateDelete> GetCalendarDetails(string calendarCode)
        {
            string sqlString = $@"select *from BUSINESS_CALENDAR_MASTER_1925 where CALENDAR_CODE='{calendarCode}'";
            var result = (await sqlFunction.ExecuteSqlQuery(sqlString)).FirstOrDefault();
            if (result != null)
            {
                string categoryId = result["CALENDAR_CATEGORY_ID"]?.ToString() ?? "";
                sqlString = $@"select *from CALENDAR_CONTROL_SHEET_1944 where CALENDAR_CODE='{calendarCode}'";
                var controlSheet = (await sqlFunction.ExecuteSqlQuery(sqlString)).FirstOrDefault();

                result.Add("controlSheet", controlSheet);
                sqlString = $@"select *from CALENDAR_CATEGORY_MASTER_1929 where Id={categoryId}";

                var category = (await sqlFunction.ExecuteSqlQuery(sqlString)).FirstOrDefault();
                result.Add("category", category);
                return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };

            }
            return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
        }

    }
}
