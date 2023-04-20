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
    public class BusinessUserService: IBusinessUserService
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
            string query = "SELECT top 1000 [Id],[created_at],[updated_at],[created_by]      ,[updated_by]      ,[COMPANY_CODE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[INSTAGRAM_URL]     ,[FACEBOOK_URL]      ,[PAGE_URL]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,[COMPANY_SERVICE]      ,[COMPANY_DESCRIPTION]      ,[CURRENT_STEP]      ,[TOTAL_WEBSITE_VISITS]      ,[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[SUBSCRIPTION_PLAN_ID]      ,[USER_ID]      ,[COMPANY_CALENDAR_STATUS]      ,[COMPANY_PROFILE_STATUS]  FROM[dbo].[BUSINESS_ACCOUNT_WEBSITE_1918] where USER_ID = '" + UserId + "'";
            
            List<IDictionary<string, object>> businessWebsiteResult = await sqlFunction.ExecuteSqlQuery(query);

            if (businessWebsiteResult.Count > 0)
            {
                var businessWebsite = businessWebsiteResult.FirstOrDefault();
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = businessWebsite };
            }
            else
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.NotFound };
            }

            
        }

    }
}
