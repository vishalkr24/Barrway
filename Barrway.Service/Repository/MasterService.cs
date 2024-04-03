using Barrway.DTO.BusinessModels;
using Barrway.DTO.Common;
using Barrway.Service.IRepository;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;
using System.IO;
using System.Configuration;

namespace Barrway.Service.Repository
{
    public class MasterService : IMasterService
    {
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;

        public MasterService(ISqlFunction sqlFunction, IFormAPIRepository formAPIRepository)
        {
            this.sqlFunction = sqlFunction;
            this.formAPIRepository = formAPIRepository;
        }

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetLocationMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            try
            {

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
                                     select calendar.CALENDAR_NAME, company.COMPANY_NAME_ENGLISH, f.* from [dbo].[LOCATION_MASTER_1936] f
join BUSINESS_CALENDAR_MASTER_1925 calendar on calendar.CALENDAR_CODE = f.CALENDAR_CODE
join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                    where f.COMPANY_CODE='{companyCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
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
        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetServiceMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            try
            {

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
                                     
select calendar.CALENDAR_NAME, company.COMPANY_NAME_ENGLISH, f.* from [dbo].[SERVICE_MASTER_1933] f
join BUSINESS_CALENDAR_MASTER_1925 calendar on calendar.CALENDAR_CODE = f.CALENDAR_CODE
join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                    where f.COMPANY_CODE='{companyCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
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

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetServiceProviderMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            try
            {

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
select calendar.CALENDAR_NAME, company.COMPANY_NAME_ENGLISH, f.* from [dbo].[SERVICE_PROVIDER_MASTER_1934] f
join BUSINESS_CALENDAR_MASTER_1925 calendar on calendar.CALENDAR_CODE = f.CALENDAR_CODE
join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                    where f.COMPANY_CODE='{companyCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
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

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetParticipantMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            try
            {

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
select calendar.CALENDAR_NAME, company.COMPANY_NAME_ENGLISH, f.* from [dbo].[PARTICIPANT_MASTER_1940] f
join BUSINESS_CALENDAR_MASTER_1925 calendar on calendar.CALENDAR_CODE = f.CALENDAR_CODE
join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                    where f.COMPANY_CODE='{companyCode}' and f.CALENDAR_CODE='{calendarCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
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

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetSchedularFormList(GenerateDynamicFormData data, string companyCode, string calendarCode)
        {
            try
            {

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
                                     select calendar.CALENDAR_NAME, company.COMPANY_NAME_ENGLISH, f.*, loc.LOCATION_BUILDING_NAME, ser.ACTIVITY_NAME, serPro.FIRST_NAME from [dbo].[SCHEDULAR_FORM_1941] f
join BUSINESS_CALENDAR_MASTER_1925 calendar on calendar.CALENDAR_CODE = f.CALENDAR_CODE
join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
                                    left join LOCATION_MASTER_1936 loc on loc.Id = f.SCH_LOCATION
                                    left join SERVICE_MASTER_1933 ser on ser.Id = f.SCH_ACTIVITY
                                    left join SERVICE_PROVIDER_MASTER_1934 serPro on serPro.Id = f.SCH_RESOURCE
                                    where f.COMPANY_CODE='{companyCode}' and f.CALENDAR_CODE='{calendarCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
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

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetTransactionMasterList(GenerateDynamicFormData data, string companyCode, string calendarCode)
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
	                                      from [dbo].[TRANSACTION_MASTER_1942] f
                                    join CALENDAR_FORM_1935 calendar on calendar.Id = f.SLOT
                                    join PARTICIPANT_MASTER_1940 participant on participant.Id = f.STUDENT
                                    join BUSINESS_CALENDAR_MASTER_1925 calendarDets on calendarDets.CALENDAR_CODE = f.CALENDAR_CODE
                                    join SERVICE_MASTER_1933 service_m on service_m.Id = f.ACTIVITY
                                    join SERVICE_PROVIDER_MASTER_1934 service_p_m on service_p_m.Id = calendar.[resources]
                                    join LOCATION_MASTER_1936 location_m on location_m.Id = f.[RESOURCE]
                                    where f.COMPANY_CODE='{companyCode}' and f.CALENDAR_CODE='{calendarCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
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
        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetClientPaymentHistory(GenerateDynamicFormData data, string companyCode, string calendarCode)
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
                            if (item.field == "created_at" || item.field == "updated_at")
                            {

                                string filter = await sqlFunction.GetDateFilter(item, "calendar");
                                applyFilter.Add(filter);
                            }
                            else
                            {
                                string filter = item.field + " like N'%" + item.value + "%'";

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
	                                      ,u.FIRST_NAME
                                          ,[ORDER_NO]
                                          ,case when [DEBIT_COIN] > 0 then [DEBIT_COIN] else [CREDIT_COIN] end as 'AMOUNT'
                                          ,cal.CALENDAR_NAME
                                          ,[TRANSACTION_TYPE]
	                                      ,history.CLIENT_PAID_HKD
	                                      ,pack.PACKAGE_NAME
	                                      ,history.STATUS
	                                      ,history.METHOD
	                                      ,f.created_at
                                      FROM [dbo].[LEDGER_MASTER_1957] f
                                      join PUBLIC_USER_ACCOUNT_1943 u on u.USER_ID = f.USER_ID
                                      join BUSINESS_CALENDAR_MASTER_1925 cal on cal.CALENDAR_CODE = f.CALENDAR_CODE
                                      join PAYMENT_HISTORY_MASTER_1956 history on history.PAYMENT_ID = f.ORDER_NO
                                      join CALENDAR_PACKAGE_MASTER_1952 pack on pack.Id = history.PLAN_ID
                                      where f.COMPANY_CODE = '{companyCode}' {(!string.IsNullOrEmpty(applyFilterQuery) ? " and " + applyFilterQuery : "")}
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

        public async Task<AddUpdateDelete> GetPaymentReceiptData(string Id)
        {
            string strSql = $@"
								SELECT f.[Id]
	                                      ,u.FIRST_NAME
                                          ,u.LAST_NAME
                                          ,[ORDER_NO]
                                          ,[DEBIT_COIN]
										  ,[CREDIT_COIN]
                                          ,cal.CALENDAR_NAME
                                          ,[TRANSACTION_TYPE]
	                                      ,history.CLIENT_PAID_HKD
	                                      ,pack.PACKAGE_NAME
	                                      ,history.STATUS
	                                      ,history.METHOD
                                          ,history.CALENDAR_CODE
										  ,history.COMPANY_CODE
                                          ,history.PAID_DATE
	                                      ,f.created_at
                                      FROM [dbo].[LEDGER_MASTER_1957] f
                                      join PUBLIC_USER_ACCOUNT_1943 u on u.USER_ID = f.USER_ID
                                      join BUSINESS_CALENDAR_MASTER_1925 cal on cal.CALENDAR_CODE = f.CALENDAR_CODE
                                      join PAYMENT_HISTORY_MASTER_1956 history on history.PAYMENT_ID = f.ORDER_NO
                                      join CALENDAR_PACKAGE_MASTER_1952 pack on pack.Id = history.PLAN_ID
                                      where f.Id = '{Id}'";

            var paymentHistory = await sqlFunction.ExecuteSqlQuery(strSql);

            strSql = $@"DECLARE @retval nvarchar(max);
                                DECLARE @sQuery nvarchar(max); 
                                DECLARE @ParmDefinition nvarchar(max);                        
                                DECLARE @customTitleQuery nvarchar(max);                          
                                IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END;
                                with cte1 as( 
	                                select distinct  f.*,
	                                f.resources 'resourceId', 
	                                STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                                                                from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle,
	                                (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,
	                                (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                                                                where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) 
	                                customForms, 
	                                (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) from form_calenderreferrence f2    
                                                                where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) 
	                                customFormIds,
	                                '' referrences_1,
	                                '' referrences_2,
	                                '' referrences_3,
	                                bcm.CALENDAR_NAME,
	                                subCategory.CALENDAR_SUB_CATEGORY_NAME
	                                from CALENDAR_FORM_1935 f  
	                                join BUSINESS_CALENDAR_MASTER_1925 bcm on bcm.CALENDAR_CODE = f.CALENDAR_CODE
	                                join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = bcm.CALENDAR_SUB_CATEGORY_ID
	                                where   f.formid=2305  and bcm.CALENDAR_CODE = '{paymentHistory[0]["CALENDAR_CODE"].ToString()}' and bcm.COMPANY_CODE = '{paymentHistory[0]["COMPANY_CODE"].ToString()}'
                                ),
                                cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1	 where len(customtitle)>0) 
                                select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= 1;   
                                select @counter = (select count(1) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                                SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';   
                                EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT;    update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end  select* from #temptable
                        ";

            var calendarData = await sqlFunction.ExecuteSqlQuery(strSql);



            PaymentReceiptViewModel paymentReceiptViewModel = new PaymentReceiptViewModel()
            {
                ActivityName = calendarData[0]["customTitle"]?.ToString().Split(',')[1]?.ToString(),
                Amount = Convert.ToDouble(paymentHistory[0]["CLIENT_PAID_HKD"]?.ToString()),
                OrderNo = paymentHistory[0]["ORDER_NO"]?.ToString(),
                PackageName = paymentHistory[0]["PACKAGE_NAME"]?.ToString(),
                PaymentDate = Convert.ToDateTime(paymentHistory[0]["PAID_DATE"]?.ToString()),
                Quantity = 1,
                PaymentStatus = (paymentHistory[0]["STATUS"]?.ToString() == "complete") ? "Success" : "Failed",
                ServiceProviderName = calendarData[0]["customTitle"]?.ToString().Split(',')[0]?.ToString(),
                ClientName = paymentHistory[0]["FIRST_NAME"]?.ToString() + paymentHistory[0]["LAST_NAME"]?.ToString(),
                TransactionType = paymentHistory[0]["TRANSACTION_TYPE"]?.ToString(),
                CoinsAdded = Convert.ToDouble(paymentHistory[0]["CREDIT_COIN"]?.ToString()),
                CoinsDeducted = Convert.ToDouble(paymentHistory[0]["DEBIT_COIN"]?.ToString())
            };

            return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = paymentReceiptViewModel };

        }

        public async Task<AddUpdateDelete> GetSingleClientPaymentHistory(string LedgerId)

        {
            try
            {
                string strSql = $@"SELECT f.[Id]
	                                      ,u.FIRST_NAME
                                          ,[ORDER_NO]
                                          ,case when [DEBIT_COIN] > 0 then [DEBIT_COIN] else [CREDIT_COIN] end as 'AMOUNT'
                                          ,cal.CALENDAR_NAME
                                          ,[TRANSACTION_TYPE]
	                                      ,history.CLIENT_PAID_HKD
	                                      ,pack.PACKAGE_NAME
	                                      ,history.STATUS
	                                      ,history.METHOD
	                                      ,f.created_at
                                      FROM [dbo].[LEDGER_MASTER_1957] f
                                      join PUBLIC_USER_ACCOUNT_1943 u on u.USER_ID = f.USER_ID
                                      join BUSINESS_CALENDAR_MASTER_1925 cal on cal.CALENDAR_CODE = f.CALENDAR_CODE
                                      join PAYMENT_HISTORY_MASTER_1956 history on history.PAYMENT_ID = f.ORDER_NO
                                      join CALENDAR_PACKAGE_MASTER_1952 pack on pack.Id = history.PLAN_ID
                                      where f.Id = '{LedgerId}'";

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

        public async Task<AddUpdateDelete> GetSingleSlotDetailsByTransactionId(string TransactionId)
        {
            try
            {
                string strSql = $@"DECLARE @retval nvarchar(max);
                                DECLARE @sQuery nvarchar(max); 
                                DECLARE @ParmDefinition nvarchar(max);                        
                                DECLARE @customTitleQuery nvarchar(max);                          
                                IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END;
                                with cte1 as( 
	                                select distinct  f.*,
	                                f.resources 'resourceId', 
	                                STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                                                                from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle,
	                                (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,
	                                (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                                                                where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) 
	                                customForms, 
	                                (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) from form_calenderreferrence f2    
                                                                where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) 
	                                customFormIds,
	                                '' referrences_1,
	                                '' referrences_2,
	                                '' referrences_3,
	                                bcm.CALENDAR_NAME,
                                    company.COMPANY_NAME_ENGLISH,
	                                subCategory.CALENDAR_SUB_CATEGORY_NAME,
                                    company.COMPANY_DESCRIPTION,
									company.COMPANY_EMAIL
	                                from CALENDAR_FORM_1935 f  
	                                join BUSINESS_CALENDAR_MASTER_1925 bcm on bcm.CALENDAR_CODE = f.CALENDAR_CODE
                                    join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
	                                join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = bcm.CALENDAR_SUB_CATEGORY_ID
	                                where   f.formid=2305  and f.Id = (select tm.SLOT from TRANSACTION_MASTER_1942 tm where tm.Id='{TransactionId}')
                                ),
                                cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1	 where len(customtitle)>0) 
                                select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= 1;   
                                select @counter = (select count(1) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                                SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';   
                                EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT;    update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end  select* from #temptable
                        ";

                var calendarData = await sqlFunction.ExecuteSqlQuery(strSql);

                if (calendarData.Count > 0)
                {
                    return new AddUpdateDelete { Status = true, Message = AppMessage.Success, Data = calendarData };
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

        public async Task<AddUpdateDelete> SendCalendarFile(string email, string TransactionId)
        {
            System.Net.Mail.MailMessage msg = new MailMessage("info@augursinnovation.com", email);

            try
            {
                var meetingDetails = await GetSingleSlotDetailsByTransactionId(TransactionId);

                StringBuilder str = new StringBuilder();
                str.AppendLine("BEGIN:VCALENDAR");
                str.AppendLine("PRODID:-//Schedule a Meeting");
                str.AppendLine("VERSION:2.0");
                str.AppendLine("METHOD:REQUEST");
                str.AppendLine("BEGIN:VEVENT");
                DateTime startTime = Convert.ToDateTime(meetingDetails.Data[0]["start"]);
                DateTime endTime = Convert.ToDateTime(meetingDetails.Data[0]["end"]);
                str.AppendLine(string.Format("DTSTART:{0:yyyyMMddTHHmmssZ}", startTime.ToString("yyyyMMddTHHmmss")));
                str.AppendLine(string.Format("DTSTAMP:{0:yyyyMMddTHHmmssZ}", DateTime.Now));
                str.AppendLine(string.Format("DTEND:{0:yyyyMMddTHHmmssZ}", endTime.ToString("yyyyMMddTHHmmss")));

                Array customForms = meetingDetails.Data[0]["customForms"].ToString().Split(',');
                var locationIndex = Array.IndexOf(customForms, "2306");
                var activityIndex = Array.IndexOf(customForms, "2303");
                var providerIndex = Array.IndexOf(customForms, "2304");
                string locationName = meetingDetails.Data[0]["customTitle"].ToString().Split(',')[locationIndex];
                string activityName = meetingDetails.Data[0]["customTitle"].ToString().Split(',')[activityIndex];
                string providerName = meetingDetails.Data[0]["customTitle"].ToString().Split(',')[providerIndex];

                str.AppendLine("LOCATION: " + locationName);
                str.AppendLine(string.Format("UID:{0}", Guid.NewGuid()));
                str.AppendLine(string.Format("DESCRIPTION:{0}", "Service Provider:" + providerName));
                str.AppendLine(string.Format("X-ALT-DESC;FMTTYPE=text/html:{0}", "Service Provider: " + providerName));
                str.AppendLine(string.Format("SUMMARY:{0}", activityName));
                str.AppendLine(string.Format("ORGANIZER:MAILTO:{0}", meetingDetails.Data[0]["COMPANY_EMAIL"].ToString()));

                str.AppendLine(string.Format("ATTENDEE;CN=\"{0}\";RSVP=TRUE:mailto:{1}", meetingDetails.Data[0]["customFourthTitle"].ToString(), email));

                str.AppendLine("BEGIN:VALARM");
                str.AppendLine("TRIGGER:-PT15M");
                str.AppendLine("ACTION:DISPLAY");
                str.AppendLine("DESCRIPTION:Reminder");
                str.AppendLine("END:VALARM");
                str.AppendLine("END:VEVENT");
                str.AppendLine("END:VCALENDAR");

                byte[] byteArray = Encoding.ASCII.GetBytes(str.ToString());
                MemoryStream stream = new MemoryStream(byteArray);

                //Attachment attach = new Attachment(stream, "test.ics");

                //msg.Attachments.Add(attach);

                System.Net.Mime.ContentType contype = new System.Net.Mime.ContentType("text/calendar");
                contype.Parameters.Add("method", "REQUEST");
                //  contype.Parameters.Add("name", "Meeting.ics");
                AlternateView avCal = AlternateView.CreateAlternateViewFromString(str.ToString(), contype);
                msg.AlternateViews.Add(avCal);

                //Now sending a mail with attachment ICS file.


                System.Net.Mail.SmtpClient smtpclient = new System.Net.Mail.SmtpClient();
                smtpclient.Host = "mail.augursinnovation.com"; //-------this has to given the Mailserver IP
                smtpclient.EnableSsl = false;
                msg.Subject = activityName + " Invitation";
                smtpclient.Credentials = new System.Net.NetworkCredential("info@augursinnovation.com", "Egoxx123");
                smtpclient.Send(msg);
            }
            catch (Exception ex)
            {

            }



            return new AddUpdateDelete()
            {
                Status = true,
                Message = AppMessage.Success
            };
        }

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetSingleTransactionMaster(string TransactionId)
        {
            string strSql = $@"select f.[Id]
                                      ,f.[created_at]
                                      ,f.[updated_at]
                                      ,f.[created_by]
                                      ,f.[updated_by]
                                      ,(select calendar.[start]+ ' to ' + calendar.[end]) as 'SLOT'
                                      ,[RESOURCE]
                                      ,[ACTIVITY]
                                      ,[STUDENT]
                                      ,[REMARKS]
                                      ,[FEES]
                                      ,[FEES_1]
                                      ,[FEES_2]
                                      ,[FEES_LIST]
                                      ,[ATTENDANCE]
                                      ,[hidden_1683717028956]
                                      ,f.[COMPANY_CODE]
                                      ,f.[CALENDAR_CODE]
	                                  ,participant.STUDENT_NAME
	                                  from [dbo].[TRANSACTION_MASTER_1942] f
                                join CALENDAR_FORM_1935 calendar on calendar.Id = f.SLOT
                                join PARTICIPANT_MASTER_1940 participant on participant.Id = f.STUDENT
                                where f.Id='{TransactionId}'";

            var listresult = await sqlFunction.ExecuteSqlQuery(strSql);
            if (listresult.Count() > 0)
            {
                return new AddUpdateDelete<List<IDictionary<string, object>>>() { Status = true, Data = listresult };
            }

            return new AddUpdateDelete<List<IDictionary<string, object>>>() { Status = false };
        }
        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllBlogPosts(GenerateDynamicFormData data)
        {
            try
            {

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
                                string filter = await sqlFunction.GetDateFilter(item, "news");
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
                                     SELECT TOP (1000) news.[Id]
                                          ,news.[created_at]
                                          ,news.[updated_at]
                                          ,news.[created_by]
                                          ,news.[updated_by]
                                          ,[POST_TITLE]
                                          ,[TAGS]
                                          ,[PUBLISH_DATE]
                                          ,[AUTHOR_ID]
	                                      ,[IS_HOT_TOPIC]
                                          ,[POST_CONTENT]
                                          ,[BLOG_IMAGE]
	                                      ,author.FIRST_NAME
	                                      ,author.LAST_NAME
                                      FROM [dbo].[NEWS_POST_MASTER_1946] news
                                      join AUTHOR_MASTER_1947 author on author.Id = news.AUTHOR_ID
                                      
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY IS_HOT_TOPIC desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

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


        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllBlog(GenerateDynamicFormData data)
        {
            try
            {

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
                                string filter = await sqlFunction.GetDateFilter(item, "news");
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

                string strSql = "";
                if (data.SearchText == null)
                {
                     strSql = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                     select  distinct  a_0.[BLOG_CATEGORY] [BLOG_CATEGORY] , a_0.[Id] [BLOG_CATEGORY_Id] ,f.Id,f.formGroupKey,f.formID,f.userID,f.Current_Status,f.cycle,f.MasterFormID,f.MasterFormRow,f.formRecordOrder,
                                        f.formRecordStatus,f.ApprovalStatus ,f.created_at,f.updated_at ,f.[BLOG_TITLE],f.[IMAGE],f.[BLOG_CONTENT],f.[TAG],f.[YOUTUBE_LINK],f.[MARKED_AS_HOT] from  BLOG_1980   f   left join  BLOG_CATEGORY_1981  a_0  on f.[BLOG_CATEGORY] = a_0.[Id]
                                      
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY [formRecordOrder] desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

                }
                else
                {
                    strSql = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                     select  distinct  a_0.[BLOG_CATEGORY] [BLOG_CATEGORY] , a_0.[Id] [BLOG_CATEGORY_Id] ,f.Id,f.formGroupKey,f.formID,f.userID,f.Current_Status,f.cycle,f.MasterFormID,f.MasterFormRow,f.formRecordOrder,
                                        f.formRecordStatus,f.ApprovalStatus ,f.created_at,f.updated_at ,f.[BLOG_TITLE],f.[IMAGE],f.[BLOG_CONTENT],f.[TAG],f.[YOUTUBE_LINK],f.[MARKED_AS_HOT] from  BLOG_1980   f   left join  BLOG_CATEGORY_1981  a_0  on f.[BLOG_CATEGORY] = a_0.[Id]
                                        where f.[TAG] like '%{data.SearchText}%'
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY [formRecordOrder] desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

                }

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


        public async Task<AddUpdateDelete> GetMasterSearchResult(string keyword)
        {
            try
            {
                List<List<IDictionary<string, object>>> finalResult = new List<List<IDictionary<string, object>>>();

                string sqlQuery = $@"select f.*,cmp.COMPANY_NAME_ENGLISH from BUSINESS_CALENDAR_MASTER_1925 f join BUSINESS_COMPANY_MASTER_1924 cmp on cmp.COMPANY_CODE = f.COMPANY_CODE where cmp.IS_TEMPLATE = 'N' and f.CALENDAR_NAME like '%{keyword}%'";
                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                finalResult.Add(result);

                sqlQuery = $@"select * from BUSINESS_COMPANY_MASTER_1924 f where f.IS_TEMPLATE = 'N' and f.COMPANY_NAME_ENGLISH like '%{keyword}%' or f.COMPANY_NAME_ENGLISH like '%{keyword}%'";
                result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                finalResult.Add(result);

                sqlQuery = $@"select f.*, cmp.COMPANY_NAME_ENGLISH, cal.CALENDAR_NAME, cal.CALENDAR_PHOTO_PATH from SERVICE_MASTER_1933 f 
                                join BUSINESS_COMPANY_MASTER_1924 cmp on cmp.COMPANY_CODE = f.COMPANY_CODE
                                join BUSINESS_CALENDAR_MASTER_1925 cal on cal.CALENDAR_CODE = f.CALENDAR_CODE
                                where f.ACTIVITY_NAME like '%{keyword}%' and cmp.IS_TEMPLATE = 'N'";
                result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                finalResult.Add(result);

                sqlQuery = $@"select * from CALENDAR_SUB_CATEGORY_MASTER_1930 f where f.CALENDAR_SUB_CATEGORY_NAME like '%{keyword}%'";
                result = await sqlFunction.ExecuteSqlQuery(sqlQuery);
                finalResult.Add(result);

                return new AddUpdateDelete() { Status = true, Data = finalResult };

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }


        public async Task<AddUpdateDelete> GetAllSubcategory()
        {
            try
            {
                

                string sqlQuery = $@"select Id,CALENDAR_SUB_CATEGORY_NAME from CALENDAR_SUB_CATEGORY_MASTER_1930";
                var result = await sqlFunction.ExecuteSqlQuery(sqlQuery);              

                return new AddUpdateDelete() { Status = true, Data = result };

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllFeaturedCompany(GenerateDynamicFormData data)
        {
            try
            {

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
                                string filter = await sqlFunction.GetDateFilter(item, "news");
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
                                         SELECT [Id]
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
                                      FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] where IS_ACTIVE = 'Y' and IS_SEARCHABLE_IN_MARKETPLACE = 'Y'
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY created_at desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";

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

        public async Task<AddUpdateDelete<List<IDictionary<string, object>>>> GetAllFeaturedCompany_SubCategoryWise(GenerateDynamicFormData data)
        {
            try
            {

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

                string strSql = "";
                if (data.SearchText != "")
                {

                    strSql = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                         SELECT [Id]
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
                                      FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] where IS_ACTIVE = 'Y' and IS_SEARCHABLE_IN_MARKETPLACE = 'Y' and COMPANY_SUB_CATEGORY_ID='{data.Id}' and COMPANY_NAME_ENGLISH like '%{data.SearchText}%'
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY created_at desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";


                }

                else
                {

                    strSql = $@"declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                         SELECT [Id]
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
                                      FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] where IS_ACTIVE = 'Y' and IS_SEARCHABLE_IN_MARKETPLACE = 'Y' and COMPANY_SUB_CATEGORY_ID='{data.Id}'
                                    )
                                    Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY created_at desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";


                    
                }


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


        public async Task<AddUpdateDelete> GetSingleBlogPost(string NewsId)
        {
            try
            {
                string query = $@"SELECT TOP (1000) news.[Id]
                                          ,news.[created_at]
                                          ,news.[updated_at]
                                          ,news.[created_by]
                                          ,news.[updated_by]
                                          ,[POST_TITLE]
                                          ,[TAGS]
                                          ,[PUBLISH_DATE]
                                          ,[AUTHOR_ID]
	                                      ,[IS_HOT_TOPIC]
                                          ,[POST_CONTENT]
                                          ,[BLOG_IMAGE]
	                                      ,author.FIRST_NAME
	                                      ,author.LAST_NAME
                                      FROM [dbo].[NEWS_POST_MASTER_1946] news
                                      Join AUTHOR_MASTER_1947 author on author.Id = news.AUTHOR_ID
                                      where news.Id = '{NewsId}'
                                      ";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);



                if (result.Count > 0)
                {
                    string tagQuery = "(";

                    try
                    {
                        if (result[0]["TAGS"].ToString().Contains(","))
                        {
                            var tagObj = result[0]["TAGS"].ToString().Split(',');
                            for (int i = 0; i < tagObj.Length; i++)
                            {
                                if (i == tagObj.Length - 1)
                                {
                                    tagQuery += "'" + tagObj[i] + "'";
                                }
                                else
                                {
                                    tagQuery += "'" + tagObj[i] + "', ";
                                }
                            }
                        }
                        else
                        {
                            tagQuery += "'" + result[0]["TAGS"].ToString() + "'";
                        }
                    }
                    catch (Exception ex)
                    {
                        tagQuery += "''";
                    }

                    tagQuery += ")";

                    string query2 = $@"SELECT TOP (5) news.[Id]
                                          ,news.[created_at]
                                          ,news.[updated_at]
                                          ,news.[created_by]
                                          ,news.[updated_by]
                                          ,[POST_TITLE]
                                          ,[TAGS]
                                          ,[PUBLISH_DATE]
                                          ,[AUTHOR_ID]
	                                      ,[IS_HOT_TOPIC]
                                          ,[POST_CONTENT]
                                          ,[BLOG_IMAGE]
	                                      ,author.FIRST_NAME
	                                      ,author.LAST_NAME
                                      FROM [dbo].[NEWS_POST_MASTER_1946] news
                                      Join AUTHOR_MASTER_1947 author on author.Id = news.AUTHOR_ID
                                      where news.TAGS in {tagQuery} and news.Id <> {result[0]["Id"].ToString()}
                                      order by news.IS_HOT_TOPIC desc
                                      ";

                    List<IDictionary<string, object>> result2 = await sqlFunction.ExecuteSqlQuery(query2);

                    List<List<IDictionary<string, object>>> result3 = new List<List<IDictionary<string, object>>>();

                    result3.Add(result);
                    result3.Add(result2);

                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result3 };
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

        public async Task<AddUpdateDelete> GetCompanyCalendarPackages(string CompanyCode)
        {
            try
            {

                string query = $@"select * from CALENDAR_PACKAGE_MASTER_1952 
                            where COMPANY_CODE = '{CompanyCode}' and IS_ACTIVE = 'Y'
                            order by PACKAGE_SEQUENCE, created_at";
                var packageResult = await sqlFunction.ExecuteSqlQuery(query);

                query = $@"select STUFF((SELECT ',' + '''' + convert(nvarchar, f2.CALENDAR_CODE) + '''' from CALENDAR_PACKAGE_MASTER_1952 f2    
                                                                where f2.COMPANY_CODE = '{CompanyCode}'   FOR XML PATH('')), 1, 1, '') as 'CalendarCodes'";
                var calendarCodesResult = await sqlFunction.ExecuteSqlQuery(query);

                query = $@"
                                
DECLARE @retval nvarchar(max);
                                DECLARE @sQuery nvarchar(max); 
                                DECLARE @ParmDefinition nvarchar(max);                        
                                DECLARE @customTitleQuery nvarchar(max);                          
                                IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END;
                                with cte1 as( 
	                                select distinct  f.*,
	                                f.resources 'resourceId', 
	                                STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                                                                from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle,
	                                (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,
	                                (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                                                                where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) 
	                                customForms, 
	                                (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) from form_calenderreferrence f2    
                                                                where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) 
	                                customFormIds,
	                                '' referrences_1,
	                                '' referrences_2,
	                                '' referrences_3,
	                                bcm.CALENDAR_NAME,
	                                subCategory.CALENDAR_SUB_CATEGORY_NAME,
									bcm.CALENDAR_PHOTO_PATH
	                                from CALENDAR_FORM_1935 f  
	                                join BUSINESS_CALENDAR_MASTER_1925 bcm on bcm.CALENDAR_CODE = f.CALENDAR_CODE
	                                join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory on subCategory.Id = bcm.CALENDAR_SUB_CATEGORY_ID
	                                where   f.formid=2305 and f.CALENDAR_CODE {(!string.IsNullOrEmpty(calendarCodesResult[0]["CalendarCodes"].ToString()) ? " in (" + calendarCodesResult[0]["CalendarCodes"].ToString() + ")" : "= ''")}
                                ),
                                cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1	 where len(customtitle)>0) 
                                select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= 1;   
                                select @counter = (select count(1) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                                SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';   
                                EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT;    update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end 
								
								select
								distinct cf.CALENDAR_SUB_CATEGORY_NAME,
								cf.CALENDAR_NAME,
								cf.CALENDAR_CODE, 
								cf.CALENDAR_PHOTO_PATH,
								STUFF((SELECT ', ' + R.ACTIVITY_NAME FROM SERVICE_MASTER_1933 AS R WHERE Id in (SELECT CAST(Item AS INTEGER) as Ids
                                        FROM dbo.SplitString(
										
										(STUFF((SELECT distinct ','+ f.activities from CALENDAR_FORM_1935 f
                                                                where f.formid=2305 and f.CALENDAR_CODE = cf.CALENDAR_CODE   FOR XML PATH('')), 1, 1, ''))
										
										
										, ',')  ) FOR XML PATH('') ) ,1,1,'') as ActivityName
								
								from #temptable cf
                                ";
                var result = await sqlFunction.ExecuteSqlQuery(query);



                List<List<IDictionary<string, object>>> finalResult = new List<List<IDictionary<string, object>>>();

                finalResult.Add(result);
                finalResult.Add(packageResult);

                return new AddUpdateDelete() { Status = true, Message = "Success", Data = finalResult };

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message.ToString() };
            }
        }

        public async Task<AddUpdateDelete> GetSingleCalendarPackage(string PackageId)
        {
            try
            {

                var query = $@"SELECT [Id]
                                  ,[CALENDAR_CODE]
                                  ,[COMPANY_CODE]
                                  ,[PACKAGE_NAME]
                                  ,[PACKAGE_PRICE]
                                  ,[PRICE_PER_SLOT]
                                  ,[PACKAGE_COIN]
                                  ,[PACKAGE_SEQUENCE]
                                  ,[PACKAGE_DESCRIPTION]
                                  ,[IS_ACTIVE]
                              FROM [dbo].[CALENDAR_PACKAGE_MASTER_1952] where Id = '{PackageId}'";
                var result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = "Success", Data = result.FirstOrDefault() };

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message.ToString() };
            }
        }

        public async Task<AddUpdateDelete> GetSingleCompanyPackage(string PackageId)
        {
            try
            {
                var disc = Convert.ToDecimal(ConfigurationManager.AppSettings["BUS_YEAR_DISC"]);
                var query = $@"SELECT [Id]
                                ,[formGroupKey]
                                ,[PLAN_NAME]
                                ,[PLAN_DESC]
                                ,[PLAN_PRICE]
                                ,[PLAN_PRICE]*12- ((PLAN_PRICE*12*{disc})/100) [YEARA_PRICE]
                                ,NUM_OF_AVAIL_CLR
								,VALID_SESSIONS
                                ,[PAYMENT_TRAN_FEE]
                                ,[PLAN_STATUS]
                                ,[created_at]
                                ,[IS_FREE_PLAN]
								,VALID_BOOKING_SESSION
                              FROM [dbo].[BUSINESS_PLAN_MASTER_1966] where PLAN_STATUS = 'ACTIVE' and Id = '{PackageId}'";
                var result = await sqlFunction.ExecuteSqlQuery(query);

                return new AddUpdateDelete() { Status = true, Message = "Success", Data = result.FirstOrDefault() };

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message.ToString() };
            }
        }

        public async Task<AddUpdateDelete> CreateOrder(OrderModel model)
        {
            try
            {
                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.ORDER_MASTER;
                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                if (formResult.res == 1)
                {
                    string OrderNo = "ORD" + formResult.Id.ToString().PadLeft(5, '0');
                    var query = $@"update ORDER_MASTER_1953 set ORDER_NO = '{OrderNo}' where Id = '{formResult.Id.ToString()}'";
                    var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = OrderNo };
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

        public async Task<AddUpdateDelete> CreateBusinessOrder(BusinessOrderModel model)
        {
            try
            {
                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.BUSINESS_ORDER_MASTER;
                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                if (formResult.res == 1)
                {
                    string OrderNo = "BZORD" + formResult.Id.ToString().PadLeft(5, '0');
                    var query = $@"update BUSINESS_ORDER_MASTER_1970 set ORDER_NO = '{OrderNo}' where Id = '{formResult.Id.ToString()}'";
                    var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                    return new AddUpdateDelete() { Message = AppMessage.Success, Status = true, Data = OrderNo };
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

        public async Task<AddUpdateDelete> CreatePaymentTracker(PaymentTrackerModel model)
        {
            try
            {
                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.PAYMENT_TRACKER;
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
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message.ToString() };
            }
        }

        public async Task<AddUpdateDelete> CreateLedgerEntry(LedgerModel model)
        {
            try
            {
                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.LEDGER_MASTER;
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
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message.ToString() };
            }
        }

        public async Task<AddUpdateDelete> CreatePaymentHistory(PaymentHistoryModel model)
        {
            try
            {
                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.PAYMENT_HISTORY_MASTER;
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
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message.ToString() };
            }
        }

        public async Task<AddUpdateDelete> CreateCompanyPaymentHistory(CompanyPaymentHistoryModel model)
        {
            try
            {
                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.COMPANY_PAYMENT_HISTORY_MASTER;
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
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message.ToString() };
            }
        }
    }
}
