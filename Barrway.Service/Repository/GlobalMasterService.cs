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

        public async Task<AddUpdateDelete> GetFilterCompanyData(string SubCategoryId, string DistrictId)
        {
            string filter = "";

            if (!string.IsNullOrEmpty(SubCategoryId))
            {
                filter += "and COMPANY_SUB_CATEGORY_ID = '" + SubCategoryId + "'";
            }

            if (!string.IsNullOrEmpty(DistrictId))
            {
                filter += "and company.DISTRICT_ID = '" + DistrictId + "'";
            }

            string query = $@"SELECT company.[Id]
                              ,company.[created_at]
                              ,company.[updated_at]
                              ,company.[created_by]
                              ,company.[updated_by]
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
                              ,company.[COMPANY_CATEGORY_ID]
                              ,[COMPANY_SUB_CATEGORY_ID]
                              ,[COUNTRY_ID]
                              ,company.[CITY_ID]
                              ,[DISTRICT_ID]
                              ,[TOTAL_WEBSITE_VISITS]
                              ,[IS_DEFAULT]
                              ,[COMPANY_EMAIL]
	                          ,[COMPANY_SUB_CATEGORY_NAME]
	                          ,[COMPANY_CATEGORY_NAME]
	                          ,[DISTRICT_NAME]
                          FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                          join COMPANY_SUB_CATEGORY_MASTER_1921 subCategory on subCategory.Id = company.COMPANY_SUB_CATEGORY_ID
                          join COMPANY_CATEGORY_MASTER_1920 category on category.Id = company.COMPANY_CATEGORY_ID
                          join DISTRICT_MASTER_1928 district on district.Id = company.DISTRICT_ID
                          where IS_SEARCHABLE_IN_MARKETPLACE = 'Y' and company.IS_ACTIVE = 'Y' {(!string.IsNullOrEmpty(filter) ? filter : "")}";

            List<IDictionary<string, object>> companyResult = await sqlFunction.ExecuteSqlQuery(query);

            if (companyResult.Count > 0)
            {

                var subCategoryData = await GetCompanySubCategoryMaster();
                List<IDictionary<string, object>> subCategory = subCategoryData.Data;


                List<List<IDictionary<string, object>>> finalList = new List<List<IDictionary<string, object>>>();

                for (int i = 0; i < subCategory.Count; i++)
                {
                    List<IDictionary<string, object>> tempList = new List<IDictionary<string, object>>();

                    for (int j = 0; j < companyResult.Count; j++)
                    {
                        if (subCategory[i]["Id"].ToString() == companyResult[j]["COMPANY_SUB_CATEGORY_ID"].ToString())
                        {
                            IDictionary<string, object> tempData = companyResult[j];
                            tempList.Add(tempData);
                        }
                    }

                    finalList.Add(tempList);
                }

                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = finalList };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
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
            string query = "SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[CALENDAR_CATEGORY_NAME]  FROM [dbo].[CALENDAR_CATEGORY_MASTER_1929]";

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

        public async Task<AddUpdateDelete> GetSingleTagData(string TagName)
        {
            //string query = $@"";

            //List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

            //if (result.Count > 0)
            //{
            //    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.ToList() };
            //}
            //else
            //{
            //    return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            //}
            return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
        }

    }
}
