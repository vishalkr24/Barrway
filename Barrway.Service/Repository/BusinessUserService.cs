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
                return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = formResult.Id.ToString() };
            }
            else
            {
                return new AddUpdateDelete() { Message = formResult.Message, Status = false };
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

        public async Task<AddUpdateDelete> GetAllCompaniesByUserId(string UserId)
        {
            string query = $@"SELECT company.[Id]      ,company.[created_at]      ,company.[updated_at]      ,company.[created_by]      ,company.[updated_by]     ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT], company.[IS_ACTIVE]  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                JOIN BUSINESS_ACCOUNT_WEBSITE_1918 business on business.Id = company.BUSINESS_ACCOUNT_ID
                                where company.IS_ACTIVE = 'Y' and business.USER_ID = '{UserId}'";

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
                                    SELECT calendar.[Id], company.IS_ACTIVE      ,calendar.[created_at]      ,calendar.[updated_at]      ,calendar.[created_by], company.[COMPANY_NAME_ENGLISH]      ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,calendar.[CALENDAR_CATEGORY_ID], category.CALENDAR_CATEGORY_NAME, subCategory.CALENDAR_SUB_CATEGORY_NAME      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
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



        public async Task<AddUpdateDelete> GetDefaultCompanyByBusinessId(string BusinessAccountId)
        {
            string query = "SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]     ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID],     [COMPANY_EMAIL]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT], [IS_ACTIVE]  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] where BUSINESS_ACCOUNT_ID = '" + BusinessAccountId + "' and IS_ACTIVE = 'Y' and  and IS_DEFAULT = 'Y'";

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
            string query = "SELECT company.[Id]      ,company.[created_at]      ,company.[updated_at]      ,company.[created_by]      ,company.[updated_by]     ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,[COMPANY_CATEGORY_ID] ,     [COMPANY_EMAIL]     ,[COMPANY_SUB_CATEGORY_ID]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT], company.[IS_ACTIVE]  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company join BUSINESS_ACCOUNT_WEBSITE_1918 business on company.BUSINESS_ACCOUNT_ID = business.Id where business.USER_ID = '" + UserId + "' and company.IS_ACTIVE = 'Y' and  IS_DEFAULT = 'Y'";

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
            string query = "SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID],     [COMPANY_EMAIL]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT],[IS_ACTIVE]  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] where IS_ACTIVE = 'Y' and  COMPANY_CODE = '" + CompanyCode + "'";

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

        public async Task<AddUpdateDelete> AddCompany(BusinessCompanyModel model, string UserId, bool IsDefault = false)
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

                string query = $@"UPDATE [dbo].[BUSINESS_COMPANY_MASTER_1924] SET 
                               [updated_at] = getdate()
                              ,[BUSINESS_ACCOUNT_ID] = '{model.BUSINESS_ACCOUNT_ID}'
                              ,[COMPANY_NAME_ENGLISH] = '{model.COMPANY_NAME_ENGLISH}'
                              ,[COMPANY_NAME_CHINESE] = N'{model.COMPANY_NAME_CHINESE}'
                              ,[COMPANY_LOGO_NAME] = '{model.COMPANY_LOGO_NAME}'
                              ,[COMPANY_LOGO_PATH] = '{model.COMPANY_LOGO_PATH}'
                              ,[COMPANY_BANNER_NAME] = '{model.COMPANY_BANNER_NAME}'
                              ,[COMPANY_BANNER_PATH] = '{model.COMPANY_BANNER_PATH}'
                              ,[COMPANY_PHONE] = '{model.COMPANY_PHONE}'
                              ,[COMPANY_ADDRESS] = '{model.COMPANY_ADDRESS}'
                              ,[FACEBOOK_URL] = '{model.FACEBOOK_URL}'
                              ,[INSTAGRAM_URL] = '{model.INSTAGRAM_URL}'
                              ,[WECHAT_URL] = '{model.WECHAT_URL}'
                              ,[TWITTER_URL] = '{model.TWITTER_URL}'
                              ,[PAGE_URL] = '{model.PAGE_URL}'
                              ,[COMPANY_DESCRIPTION] = '{model.COMPANY_DESCRIPTION}'
                              ,[TAGS] = '{model.TAGS}'
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
                    var website = await GetSingleBusinessWebsite(UserId);

                    if (website.Status)
                    {
                        if (website.Data["COMPANY_PROFILE_STATUS"].ToString() == "N")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set COMPANY_PROFILE_STATUS = 'Y', updated_at = getdate() where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }


                        if (website.Data["CURRENT_STEP"].ToString() != "COMPLETED")
                        {
                            if (website.Data["CURRENT_STEP"].ToString() == "COMPANY PROFILE")
                            {
                                query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'CALENDAR', updated_at = getdate()  where USER_ID = '" + UserId + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                            }
                            else if (website.Data["CURRENT_STEP"].ToString() == "COMPANY WEBSITE")
                            {
                                query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPLETED', updated_at = getdate()  where USER_ID = '" + UserId + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                                // registration and 3 steps are completed here and now activate free plan of user

                                if (saveResult > 0)
                                {
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

                string query = $@"UPDATE [dbo].[BUSINESS_CALENDAR_MASTER_1925]
                                   SET [updated_at] = getdate()
                                      ,[CALENDAR_NAME] = '{model.CALENDAR_NAME}'
                                      ,[CALENDAR_PHOTO_NAME] = '{model.CALENDAR_PHOTO_NAME}'
                                      ,[CALENDAR_PHOTO_PATH] = '{model.CALENDAR_PHOTO_PATH}'
                                      ,[IS_VISIBLE] = '{model.IS_VISIBLE}'
                                      ,[COUNTRY_ID] = '{model.COUNTRY_ID}'
                                      ,[CITY_ID] = '{model.CITY_ID}'
                                      ,[DISTRICT_ID] = '{model.DISTRICT_ID}'
                                      ,[CALENDAR_CATEGORY_ID] = '{model.CALENDAR_CATEGORY_ID}'
                                      ,[CALENDAR_SUB_CATEGORY_ID] = '{model.CALENDAR_SUB_CATEGORY_ID}'
                                      ,[COMPANY_CODE] = '{model.COMPANY_CODE}'
                                 WHERE Id = '{model.Id}'";

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
                return new AddUpdateDelete() {Data= result, Message=AppMessage.Success,Status=true };

            }
            return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
        }

    }
}
