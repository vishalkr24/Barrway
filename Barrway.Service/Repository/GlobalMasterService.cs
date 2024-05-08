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
using Newtonsoft.Json;

namespace Barrway.Service.Repository
{
    public class GlobalMasterService: IGlobalMasterService
    {
        private readonly string connectionString;
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;

        public GlobalMasterService(IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction)
        {
            this.connectionString = ConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
        }

        
        public async Task<AddUpdateDelete> GetCompanyCategoryMaster()
        {
            string query = "SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[COMPANY_CATEGORY_NAME]  FROM [dbo].[COMPANY_CATEGORY_MASTER_1920]";

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

        public async Task<AddUpdateDelete> getCompanyWebsitePalette()
        {
            string query = "select * from WEBSITE_PALETTE_MASTER_1972";

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

        public async Task<AddUpdateDelete> GetCompanySubCategoryMaster()
        {
            string query = "SELECT [Id]        ,[COMPANY_SUB_CATEGORY_NAME]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[COMPANY_CATEGORY_ID]  FROM [dbo].[COMPANY_SUB_CATEGORY_MASTER_1921]";

            List<IDictionary<string, object>> companySubCategoryResult = await sqlFunction.ExecuteSqlQuery(query);

            if (companySubCategoryResult.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = companySubCategoryResult.ToList() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<AddUpdateDelete> GetFilterCompanyData(string CategoryId, string SubCategoryId, string DistrictId)
        {
            string filter = "";

            if (!string.IsNullOrEmpty(CategoryId))
            {
                filter += "and calendar.CALENDAR_COMMON_CATEGORY_ID = '" + CategoryId + "'";
            }


            if (!string.IsNullOrEmpty(SubCategoryId))
            {
                filter += "and CALENDAR_SUB_CATEGORY_ID = '" + SubCategoryId + "'";
            }

            if (!string.IsNullOrEmpty(DistrictId))
            {
                filter += "and company.DISTRICT_ID = '" + DistrictId + "'";
            }

            //   string query = $@"SELECT calendar.[Id]
            //                     ,calendar.[created_at]
            //                     ,calendar.[updated_at]
            //                     ,calendar.[created_by]
            //                     ,calendar.[updated_by]
            //                     ,[CALENDAR_NAME]
            //                     ,[CALENDAR_PHOTO_NAME]
            //                     ,[CALENDAR_PHOTO_PATH]
            //                     ,[IS_VISIBLE]
            //                     ,calendar.[COUNTRY_ID]
            //                     ,calendar.[CITY_ID]
            //                     ,calendar.[DISTRICT_ID]
            //                     ,calendar.[CALENDAR_CATEGORY_ID]
            //                     ,calendar.[CALENDAR_COMMON_CATEGORY_ID]
            //                     ,calendar.[CALENDAR_SUB_CATEGORY_ID]
            //                     ,calendar.[CALENDAR_TYPE]
            //                     ,calendar.[COMPANY_CODE]
            //                     ,calendar.[CALENDAR_CODE]
            //                  ,[CALENDAR_SUB_CATEGORY_NAME]
            //                  ,[CMN_CATEGORY_NAME]
            //                  ,[DISTRICT_NAME]
            //                  ,calendar.TAGS
            //                  ,[COMPANY_NAME_ENGLISH]
            //                     ,[COMPANY_NAME_CHINESE]
            //                     ,[COMPANY_LOGO_NAME]
            //                     ,[COMPANY_LOGO_PATH]
            //                     ,[COMPANY_BANNER_NAME]
            //                     ,[COMPANY_BANNER_PATH]
            //,[IS_SEARCHABLE_IN_MARKETPLACE]
            //                     ,company.PAGE_URL
            //                     ,calendar.IS_FEATURED
            //                     ,category.Id AS  CategoryId                    
            //                FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
            //                join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = calendar.CALENDAR_SUB_CATEGORY_ID
            //                join CALENDAR_COMMON_CATEGORY_1978 category on category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
            //                join DISTRICT_MASTER_1928 district on district.Id = calendar.DISTRICT_ID
            //                join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE

            //                where calendar.STATUS = 'PUBLISH' and company.IS_SEARCHABLE_IN_MARKETPLACE = 'Y' and company.IS_ACTIVE = 'Y' and company.IS_TEMPLATE = 'N' and calendar.CALENDAR_USE_TYPE = 'PUBLIC' and calendar.IS_VISIBLE_ON_MARKETPLACE_HOME='Y'  {(!string.IsNullOrEmpty(filter) ? filter : "")} ORDER BY  calendar.[PRIORITY] DESC , calendar.[SEQUENCE] asc";




            string query = $@"select *from(SELECT calendar.[Id]
                              ,calendar.[created_at]
                              ,calendar.[updated_at]
                              ,calendar.[created_by]
                              ,calendar.[updated_by]
                              ,[CALENDAR_NAME]
                              ,[CALENDAR_PHOTO_NAME]
                              ,[CALENDAR_PHOTO_PATH]
                              ,[IS_VISIBLE]
                              ,calendar.[COUNTRY_ID]
                              ,calendar.[CITY_ID]
                              ,calendar.[DISTRICT_ID]
                              ,calendar.[CALENDAR_CATEGORY_ID]
                              ,calendar.[CALENDAR_COMMON_CATEGORY_ID]
                              ,calendar.[CALENDAR_SUB_CATEGORY_ID]
                              ,calendar.[CALENDAR_TYPE]
                              ,calendar.[COMPANY_CODE]
                              ,calendar.[CALENDAR_CODE]
                              ,(STUFF((SELECT ',' + CONVERT(NVARCHAR(MAX), d.[CALENDAR_SUB_CATEGORY_NAME]) FROM CALENDAR_SUB_CATEGORY_MASTER_1930 AS d INNER JOIN BUSINESS_CALENDAR_MASTER_1925 AS ei ON ',' + CONVERT(VARCHAR(12), ei.[CALENDAR_SUB_CATEGORY_ID]) + ',' LIKE '%,' + CONVERT(VARCHAR(12), d.[Id]) + ',%' WHERE ei.[Id] = calendar.[Id] ORDER BY d.[CALENDAR_SUB_CATEGORY_NAME] FOR XML PATH('')), 1, 1, N'')) as CALENDAR_SUB_CATEGORY_NAME
	                          ,[CMN_CATEGORY_NAME]
	                          ,[DISTRICT_NAME]
	                          ,calendar.TAGS
	                          ,[COMPANY_NAME_ENGLISH]
                              ,[COMPANY_NAME_CHINESE]
                              ,[COMPANY_LOGO_NAME]
                              ,[COMPANY_LOGO_PATH]
                              ,[COMPANY_BANNER_NAME]
                              ,[COMPANY_BANNER_PATH]
							  ,[IS_SEARCHABLE_IN_MARKETPLACE]
                              ,company.PAGE_URL
                              ,calendar.IS_FEATURED
                              ,category.Id AS  CategoryId      
                              ,calendar.[PRIORITY],calendar.[SEQUENCE]
                         FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                         left join  CALENDAR_SUB_CATEGORY_MASTER_1930  subCategory on EXISTS(SELECT * FROM split_string(calendar.[CALENDAR_SUB_CATEGORY_ID] , ',') where tuple=subCategory.[Id]) 
                         join CALENDAR_COMMON_CATEGORY_1978 category on category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
                         join DISTRICT_MASTER_1928 district on district.Id = calendar.DISTRICT_ID
                         join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE

                         where calendar.STATUS = 'PUBLISH' and company.IS_SEARCHABLE_IN_MARKETPLACE = 'Y' and company.IS_ACTIVE = 'Y' and company.IS_TEMPLATE = 'N' and calendar.CALENDAR_USE_TYPE = 'PUBLIC' and calendar.IS_VISIBLE_ON_MARKETPLACE_HOME='Y'  {(!string.IsNullOrEmpty(filter) ? filter : "")}) as t ORDER BY  t.[PRIORITY] DESC , t.[SEQUENCE] asc";







            List<IDictionary<string, object>> companyResult = await sqlFunction.ExecuteSqlQuery(query);

            var CategoryData = await GetCalendarCommonCategoryMaster();
            List<IDictionary<string, object>> category = CategoryData.Data;


            List<List<IDictionary<string, object>>> finalList = new List<List<IDictionary<string, object>>>();

            for (int i = 0; i < category.Count; i++)
            {
                List<IDictionary<string, object>> tempList = new List<IDictionary<string, object>>();

                for (int j = 0; j < companyResult.Count; j++)
                {
                    if (category[i]["Id"].ToString() == companyResult[j]["CALENDAR_COMMON_CATEGORY_ID"].ToString())
                    {
                        IDictionary<string, object> tempData = companyResult[j];
                        tempData.Add("NumberOfCalendar", category[i]["NumberOfCalanders"]);
                        tempList.Add(tempData);
                    }
                }

                finalList.Add(tempList);
            }

            return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = finalList };
        }

        public async Task<AddUpdateDelete> GetCompanySubCategoryMaster(string CategoryId)
        {
            string query = "SELECT [Id]        ,[COMPANY_SUB_CATEGORY_NAME]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[COMPANY_CATEGORY_ID]  FROM [dbo].[COMPANY_SUB_CATEGORY_MASTER_1921] where COMPANY_CATEGORY_ID = '" + CategoryId + "'";

            List<IDictionary<string, object>> companySubCategoryResult = await sqlFunction.ExecuteSqlQuery(query);

            if (companySubCategoryResult.Count > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = companySubCategoryResult.ToList() };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

       


        public async Task<AddUpdateDelete> GetCountryMaster()
        {
            string query = "SELECT [Id]        ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[COUNTRY_NAME]  FROM [dbo].[COUNTRY_MASTER_1926]";

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

        public async Task<AddUpdateDelete> GetCityMaster(string countryId)
        {
            string query = $@"SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[CITY_NAME]      ,[COUNTRY_ID]  FROM [dbo].[CITY_MASTER_1927] WHERE COUNTRY_ID = '{countryId}'";

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

        public async Task<AddUpdateDelete> GetDistrictMaster(string cityId)
        {
            string query = $@"SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[DISTRICT_NAME]      ,[CITY_ID]  FROM [dbo].[DISTRICT_MASTER_1928] WHERE CITY_ID = '{cityId}'";

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

        public async Task<AddUpdateDelete> GetDistrictMaster()
        {
            string query = $@"SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[DISTRICT_NAME]      ,[CITY_ID]  FROM [dbo].[DISTRICT_MASTER_1928]";

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

        public async Task<AddUpdateDelete> GetCalendarCategoryMaster()
        {
            string query = "SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[CALENDAR_CATEGORY_NAME]  FROM [dbo].[CALENDAR_CATEGORY_MASTER_1929] ORDER BY Sequence ASC"; 

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

        public async Task<AddUpdateDelete> GetCalendarCommonCategoryMaster()
        {
            //string query = "SELECT *  FROM [dbo].[CALENDAR_COMMON_CATEGORY_1978] ORDER BY SEQUENCE ASC";
            string query = "SELECT Cl.*,Cl.CMN_CATEGORY_NAME,(select count(Id)  from BUSINESS_CALENDAR_MASTER_1925 where CALENDAR_COMMON_CATEGORY_ID=Cl.Id and [STATUS] = 'PUBLISH' and CALENDAR_USE_TYPE = 'PUBLIC') as NumberOfCalanders    FROM [dbo].[CALENDAR_COMMON_CATEGORY_1978] Cl ORDER BY SEQUENCE ASC";

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

        public async Task<AddUpdateDelete> GetCalendarSubCategoryMaster(string CalendarCategoryId)
        {
            string query = $@"SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[CALENDAR_SUB_CATEGORY_NAME]      ,[CALENDAR_CATEGORY_ID]  FROM [dbo].[CALENDAR_SUB_CATEGORY_MASTER_1930] WHERE CALENDAR_CATEGORY_ID = '{CalendarCategoryId}'";

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

        public async Task<AddUpdateDelete> GetCalendarSubCategoryMaster()
        {
            string query = $@"SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[CALENDAR_SUB_CATEGORY_NAME]      ,[CALENDAR_CATEGORY_ID]  FROM [dbo].[CALENDAR_SUB_CATEGORY_MASTER_1930]";

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

        public async Task<AddUpdateDelete> GetSingleTagData(string TagName)
        {
            if (string.IsNullOrEmpty(TagName))
            {
                TagName = "";
            }

            PublicTagDataModel TagData = new PublicTagDataModel();

            string query = $@"SELECT calendar.[Id]
                              ,calendar.[created_at]
                              ,calendar.[updated_at]
                              ,calendar.[created_by]
                              ,calendar.[updated_by]
                              ,[CALENDAR_NAME]
                              ,[CALENDAR_PHOTO_NAME]
                              ,[CALENDAR_PHOTO_PATH]
                              ,[IS_VISIBLE]
                              ,calendar.[COUNTRY_ID]
                              ,calendar.[CITY_ID]
                              ,calendar.[DISTRICT_ID]
                              ,[CALENDAR_CATEGORY_ID]
                              ,[CALENDAR_COMMON_CATEGORY_ID]
                              ,[CALENDAR_SUB_CATEGORY_ID]
                              ,calendar.[COMPANY_CODE]
                              ,[CALENDAR_CODE]
                              ,calendar.[TAGS]
                              ,[CITY_NAME]
	                          ,[COMPANY_NAME_ENGLISH]
	                          ,[COMPANY_NAME_CHINESE]
                          FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                          join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
                          join CITY_MASTER_1927 city on city.Id = calendar.CITY_ID
                          where calendar.Tags like '%{TagName.Trim()}%'";

            List<IDictionary<string, object>> calendarTagResult = await sqlFunction.ExecuteSqlQuery(query);

            var calendarDataEncrypt = JsonConvert.SerializeObject(calendarTagResult);

            TagData.calendars = JsonConvert.DeserializeObject<List<BusinessCalendarModel>>(calendarDataEncrypt);
            
            query = $@"SELECT [Id]
                      ,[created_at]
                      ,[updated_at]
                      ,[created_by]
                      ,[updated_by]
                      ,[BUSINESS_ACCOUNT_ID]
                      ,[COMPANY_CODE]
                      ,[COMPANY_NAME_ENGLISH]
                      ,[COMPANY_NAME_CHINESE]
                      ,[COMPANY_LOGO_NAME]
                      ,[COMPANY_LOGO_PATH]
                      ,[COMPANY_BANNER_NAME]
                      ,[COMPANY_BANNER_PATH]
                      ,[COMPANY_PHONE]
                      ,[COMPANY_ADDRESS]
                      ,[FACEBOOK_URL]
                      ,[INSTAGRAM_URL]
                      ,[WECHAT_URL]
                      ,[TWITTER_URL]
                      ,[PAGE_URL]
                      ,[COMPANY_DESCRIPTION]
                      ,[COMPANY_SERVICE]
                      ,[TAGS]
                      ,[IS_SEARCHABLE_IN_MARKETPLACE]
                      ,[COMPANY_CATEGORY_ID]
                      ,[COMPANY_SUB_CATEGORY_ID]
                      ,[COUNTRY_ID]
                      ,[CITY_ID]
                      ,[DISTRICT_ID]
                      ,[TOTAL_WEBSITE_VISITS]
                      ,[IS_DEFAULT]
                      ,[COMPANY_EMAIL]
                      ,[IS_ACTIVE]
                  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] where TAGS like '%{TagName.Trim()}%'";

            List<IDictionary<string, object>> companyTagResult = await sqlFunction.ExecuteSqlQuery(query);

            var companyDataEncrypt = JsonConvert.SerializeObject(companyTagResult);

            TagData.companies = JsonConvert.DeserializeObject<List<BusinessCompanyModel>>(companyDataEncrypt);

            return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = TagData };
        }

    }
}
