using Barrway.DTO.Common;
using Barrway.Service.IRepository;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.Repository
{
    public class MasterService: IMasterService
    {
        private readonly ISqlFunction sqlFunction;

        public MasterService(ISqlFunction sqlFunction)
        {
            this.sqlFunction = sqlFunction;
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
                            applyFilter.Add("f.[" +data.filter.field + "]  " + data.filter.type + " '%" + data.filter.value + "%'");
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
                            if(item.field=="created_at" || item.field == "updated_at")
                            {
                                string filter =await sqlFunction.GetDateFilter(item);
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
                                     select *from [dbo].[LOCATION_MASTER_1936] f
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
                                     select *from [dbo].[SERVICE_MASTER_1933] f
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
                                     select *from [dbo].[SERVICE_PROVIDER_MASTER_1934] f
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
                                     select *from [dbo].[PARTICIPANT_MASTER_1940] f
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
                                     select *from [dbo].[SCHEDULAR_FORM_1941] f
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
                                     select *from [dbo].[TRANSACTION_MASTER_1942] f
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

    }
}
