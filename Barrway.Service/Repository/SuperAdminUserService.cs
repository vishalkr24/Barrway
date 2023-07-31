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

namespace Barrway.Service.Repository
{
    public class SuperAdminUserService : ISuperAdminUserService
    {
        private readonly string connectionString;
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly IAuthService authService;
        private readonly IMasterService masterService;

        public SuperAdminUserService(IFormAPIRepository formAPIRepository, ISqlFunction sqlFunction, IAuthService authService, IMasterService masterService)
        {
            this.connectionString = ConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;
            this.formAPIRepository = formAPIRepository;
            this.sqlFunction = sqlFunction;
            this.authService = authService;
            this.masterService = masterService;
        }

        public async Task<AddUpdateDelete> GetDashboardData()
        {
            try
            {
                string query = $@"select (select Count(*) from USER_MASTER_1915 where ROLE_ID = 1) as 'BusinessUserCount', (select Count(*) from USER_MASTER_1915 where ROLE_ID = 2) as 'PublicUserCount', (select Count(*) from USER_MASTER_1915 where ROLE_ID = 3) as 'SuperUserCount',  (select Count(*) from BUSINESS_COMPANY_MASTER_1924) as 'TotalCompanies',  (select Count(*) from BUSINESS_CALENDAR_MASTER_1925) as 'TotalCalendars'";
                var result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = result };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Failed", Data = result };
                }

            }catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> GetAllUsers(GenerateDynamicFormData data, string role)
        {
            try {
                Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "USER_ID","f.USER_ID"},
                    { "USER_EMAIL","f.USER_EMAIL"},
                    { "USER_PASSWORD","F.USER_PASSWORD"},
                    { "SIGNUP_TYPE","F.SIGNUP_TYPE"},
                    { "IS_ACTIVE","f.IS_ACTIVE"},
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
                            if (item.field == "created_at" || item.field == "updated_at")
                            {
                                string filter = await sqlFunction.GetDateFilter(item);
                                applyFilter.Add(filter);
                            }
                            else
                            {
                                string filter = "f.[" + item.field + "] like N'%" + item.value + "%'";
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
                                   SELECT f.[Id]
                                          ,[USER_ID]
                                          ,[USER_PASSWORD]
                                          ,[USER_EMAIL]
                                          ,[USER_PHONE]
                                          ,[IS_EMAIL_VERIFIED]
                                          ,[IS_PHONE_VERIFIED]
                                          ,f.[created_at]
                                          ,f.[updated_at]
                                          ,[IS_ACTIVE]
                                          ,[PROFILE_STATUS]
                                          ,role_m.ROLE_NAME
                                          ,[SIGNUP_TYPE]
                                      FROM [dbo].[USER_MASTER_1915] f
                                      join ROLE_MASTER_1917 role_m on role_m.Id = f.ROLE_ID
                                      where f.ROLE_ID = '{role}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

                var listresult = await sqlFunction.ExecuteSqlQuery(strSql);
                if (listresult.Count() > 0)
                {
                    return new AddUpdateDelete() { Status = true, Data = listresult };
                }

                return new AddUpdateDelete() { Status = false };

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> ActiveInactiveUser(string UserId, string Status)
        {
            try
            {
                string query = $@"update USER_MASTER_1915 set IS_ACTIVE = '{Status}' where Id = '{UserId}'";
                
                var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (result > 0)
                {
                    return new AddUpdateDelete { Status = true, Data = result, Message = "Success" };
                }
                else
                {
                    return new AddUpdateDelete { Status = false, Data = result, Message = "Failed" };
                }

            }catch (Exception ex)
            {
                return new AddUpdateDelete { Status = false, Message = ex.ToString() };
            }
        }

        public async Task<AddUpdateDelete> GetCompanyMasterWithCalendars(GenerateDynamicFormData data, string UserId)
        {
            try
            {
                Dictionary<string, string> filters = new Dictionary<string, string>() {
                    { "COMPANY_NAME_ENGLISH","COMPANY_NAME_ENGLISH"},
                    { "CALENDAR_NAME","CALENDAR_NAME"},
                    { "CALENDAR_CATEGORY_NAME","CALENDAR_CATEGORY_NAME"},
                    { "CALENDAR_SUB_CATEGORY_NAME","CALENDAR_SUB_CATEGORY_NAME"},
                    { "SLOT_DURATION_IN_MINS","SLOT_DURATION_IN_MINS"},
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
                            if (item.field == "created_at" || item.field == "updated_at")
                            {
                                string filter = await sqlFunction.GetDateFilter(item);
                                applyFilter.Add(filter);
                            }
                            else
                            {
                                string filter = "f.[" + item.field + "] like N'%" + item.value + "%'";
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
                                          select 
                                          [CALENDAR_NAME]
                                          ,cal.created_at
                                          ,cal.updated_at
                                              ,[CALENDAR_PHOTO_NAME]
                                              ,[CALENDAR_PHOTO_PATH]
                                              ,[IS_VISIBLE]
                                              ,f.[COUNTRY_ID]
                                              ,f.[CITY_ID]
                                              ,f.[DISTRICT_ID]
                                              ,[CALENDAR_CATEGORY_NAME]
                                              ,[CALENDAR_SUB_CATEGORY_NAME]
                                              ,[COMPANY_NAME_ENGLISH]
                                              ,[CALENDAR_CODE]
                                              ,f.[TAGS]
                                              ,[SLOT_DURATION_IN_MINS]
	                                          ,BUSINESS_ACCOUNT_ID
                                          from BUSINESS_COMPANY_MASTER_1924 f
  
                                          left join BUSINESS_CALENDAR_MASTER_1925 cal on cal.COMPANY_CODE = f.COMPANY_CODE
                                          left join CALENDAR_CATEGORY_MASTER_1929 cat on cat.Id = cal.CALENDAR_CATEGORY_ID
                                          left join CALENDAR_SUB_CATEGORY_MASTER_1930 subCat on subCat.Id = cal.CALENDAR_SUB_CATEGORY_ID
                                          where BUSINESS_ACCOUNT_ID = (select Id from BUSINESS_ACCOUNT_WEBSITE_1918 where USER_ID = '{UserId}') {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY {column} {dir} OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

                var listresult = await sqlFunction.ExecuteSqlQuery(strSql);
                if (listresult.Count() > 0)
                {
                    return new AddUpdateDelete() { Status = true, Data = listresult };
                }

                return new AddUpdateDelete() { Status = false };


            }
            catch (Exception ex)
            {
                return new AddUpdateDelete { Status = false, Message = ex.ToString() };
            }
        }

    }
}
