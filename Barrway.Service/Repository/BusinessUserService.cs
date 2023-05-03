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
            string query = "SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]     ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE],     [COMPANY_EMAIL]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE],     [COMPANY_EMAIL]      ,[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT]  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] where Id = '" + Id + "'";

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
            string query = $@"SELECT company.[Id]      ,company.[created_at]      ,company.[updated_at]      ,company.[created_by]      ,company.[updated_by]     ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT]  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                JOIN BUSINESS_ACCOUNT_WEBSITE_1918 business on business.Id = company.BUSINESS_ACCOUNT_ID
                                where business.USER_ID = '{UserId}'";

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
            string query = $@"SELECT calendar.[Id]      ,calendar.[created_at]      ,calendar.[updated_at]      ,calendar.[created_by]      ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,[CALENDAR_CATEGORY_ID]      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                where company.Id = '${CompanyId}'";                                                                  

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

        public async Task<AddUpdateDelete> GetDefaultCompanyByBusinessId(string BusinessAccountId)
        {
            string query = "SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]     ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID],     [COMPANY_EMAIL]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT]  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] where BUSINESS_ACCOUNT_ID = '" + BusinessAccountId + "' and IS_DEFAULT = 'Y'";

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
            string query = "SELECT company.[Id]      ,company.[created_at]      ,company.[updated_at]      ,company.[created_by]      ,company.[updated_by]     ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,[COMPANY_CATEGORY_ID] ,     [COMPANY_EMAIL]     ,[COMPANY_SUB_CATEGORY_ID]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT]  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company join BUSINESS_ACCOUNT_WEBSITE_1918 business on company.BUSINESS_ACCOUNT_ID = business.Id where business.USER_ID = '" + UserId + "' and IS_DEFAULT = 'Y'";

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
            string query = "SELECT [Id]      ,[created_at]      ,[updated_at]      ,[created_by]      ,[updated_by]      ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,[COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,[FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,[COMPANY_CATEGORY_ID]      ,[COMPANY_SUB_CATEGORY_ID],     [COMPANY_EMAIL]      ,[COUNTRY_ID]      ,[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT]  FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] where COMPANY_CODE = '" + CompanyCode + "'";

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
                               [updated_at] = '{DateTime.Now.ToString()}'
                              ,[COMPANY_CODE] = '{CompanyCode}'
                              WHERE Id = '{formResult.Id.ToString()}'";
                    int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);

                    var website = await GetSingleBusinessWebsite(UserId);

                    if (website.Status)
                    {
                        if (website.Data["COMPANY_PROFILE_STATUS"].ToString() == "N")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set COMPANY_PROFILE_STATUS = 'Y', updated_at = '" + DateTime.Now.ToString() + "' where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (website.Data["CURRENT_STEP"].ToString() == "COMPANY PROFILE")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'CALENDAR', updated_at = '" + DateTime.Now.ToString() + "'  where USER_ID = '" + UserId + "'";
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
                if (string.IsNullOrEmpty(model.IS_SEARCHABLE_IN_MARKETPLACE))
                {
                    model.IS_SEARCHABLE_IN_MARKETPLACE = "Y";
                }

                string query = $@"UPDATE [dbo].[BUSINESS_COMPANY_MASTER_1924] SET 
                               [updated_at] = '{DateTime.Now.ToString()}'
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
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set COMPANY_PROFILE_STATUS = 'Y', updated_at = '" + DateTime.Now.ToString() + "' where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }


                        if (website.Data["CURRENT_STEP"].ToString() != "COMPLETED")
                        {
                            if (website.Data["CURRENT_STEP"].ToString() == "COMPANY PROFILE")
                            {
                                query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'CALENDAR', updated_at = '" + DateTime.Now.ToString() + "'  where USER_ID = '" + UserId + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                            }
                            else if (website.Data["CURRENT_STEP"].ToString() == "COMPANY WEBSITE")
                            {
                                query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPLETED', updated_at = '" + DateTime.Now.ToString() + "'  where USER_ID = '" + UserId + "'";
                                saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
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
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set COMPANY_CALENDAR_STATUS = 'Y', updated_at = '" + DateTime.Now.ToString() + "' where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (website.Data["CURRENT_STEP"].ToString() == "CALENDAR")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPANY WEBSITE', updated_at = '" + DateTime.Now.ToString() + "'  where USER_ID = '" + UserId + "'";
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

                string query = $@"UPDATE [dbo].[BUSINESS_CALENDAR_MASTER_1925]
                                   SET,[updated_at] = '{DateTime.Now.ToString()}'=
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
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set COMPANY_CALENDAR_STATUS = 'Y', updated_at = '" + DateTime.Now.ToString() + "' where USER_ID = '" + UserId + "'";
                            saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                        }

                        if (website.Data["CURRENT_STEP"].ToString() == "CALENDAR")
                        {
                            query = "update BUSINESS_ACCOUNT_WEBSITE_1918 set CURRENT_STEP = 'COMPANY WEBSITE', updated_at = '" + DateTime.Now.ToString() + "'  where USER_ID = '" + UserId + "'";
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

    }
}
