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

    }
}
