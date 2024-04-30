using Barrway.DTO.APIModels.Company;
using Barrway.DTO.APIModels.Dashboard;
using Barrway.DTO.APIModels.SearchAPI;
using Barrway.DTO.Common;
using Barrway.Service.IRepository;
using Barrway.Utility.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.Repository
{
    public class MobileAPIService : IMobileAPIService
    {
        private readonly ISqlFunction sqlFunction;
        private readonly string baseUrl = ConfigurationManager.AppSettings["baseurl"];

        public MobileAPIService(ISqlFunction sqlFunction)
        {
            this.sqlFunction = sqlFunction;
        }

        public async Task<SearchFilterModel> GetSearchFilter()
        {

            string sqlString = $@"select Id,CALENDAR_SUB_CATEGORY_NAME from CALENDAR_SUB_CATEGORY_MASTER_1930";
            var subcategoryList = (await sqlFunction.ExecuteSqlQuery<SubCategoryFilterModel>(sqlString)).ToList();
            sqlString = $@"select Id,DISTRICT_NAME  from DISTRICT_MASTER_1928";
            var districtList = (await sqlFunction.ExecuteSqlQuery<DistrictFilterModel>(sqlString)).ToList();
            SearchFilterModel searchFilterModel = new SearchFilterModel()
            {
                SubCategoryList = subcategoryList,
                DistrictList = districtList
            };
            return searchFilterModel;
        }
        public async Task<List<CategoryModel>> GetCategoryList()
        {
            string sqlString = $@"select Id,CMN_CATEGORY_NAME,CATEGORY_IMG,[SEQUENCE] from CALENDAR_COMMON_CATEGORY_1978 order by [SEQUENCE]";
            var categoryList = (await sqlFunction.ExecuteSqlQuery<CategoryModel>(sqlString)).ToList();
            return categoryList;
        }

        public async Task<List<RootCalendarModel>> GetDashboardCalendarList()
        {
            string sqlString = $@"SELECT 
                                  calendar.[Id],calendar.[created_at],calendar.[CALENDAR_NAME],calendar.[CALENDAR_PHOTO_NAME],calendar.[CALENDAR_PHOTO_PATH],category.Id AS [CALENDAR_CATEGORY_ID],calendar.[CALENDAR_SUB_CATEGORY_ID],
                                  calendar.[COMPANY_CODE],calendar.[CALENDAR_CODE],subCategory.[CALENDAR_SUB_CATEGORY_NAME],category.[CMN_CATEGORY_NAME] CATEGORY_NAME,district.[DISTRICT_NAME],calendar.[TAGS],
                                  company.[COMPANY_NAME_ENGLISH],company.[COMPANY_NAME_CHINESE],company.[COMPANY_LOGO_NAME],company.[COMPANY_LOGO_PATH],company.[COMPANY_BANNER_NAME],company.[COMPANY_BANNER_PATH],
                                  company.[PAGE_URL], calendar.[IS_FEATURED]              
                                  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                  JOIN CALENDAR_COMMON_CATEGORY_1978 category ON category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
                                  left JOIN DISTRICT_MASTER_1928 district ON district.Id = calendar.DISTRICT_ID
                                  JOIN BUSINESS_COMPANY_MASTER_1924 company ON company.COMPANY_CODE = calendar.COMPANY_CODE
                                  join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory  ON CHARINDEX(',' + CAST(subCategory.Id AS NVARCHAR(MAX)) + ',', ',' + calendar.CALENDAR_SUB_CATEGORY_ID + ',') > 0
                                  WHERE  calendar.STATUS = 'PUBLISH' 
                                  AND company.IS_SEARCHABLE_IN_MARKETPLACE = 'Y' 
                                  AND company.IS_ACTIVE = 'Y' 
                                  AND company.IS_TEMPLATE = 'N' 
                                  AND calendar.CALENDAR_USE_TYPE = 'PUBLIC'
                                  AND calendar.IS_VISIBLE_ON_MARKETPLACE_HOME = 'Y'  
                                  ORDER BY calendar.[PRIORITY] DESC, calendar.[SEQUENCE] ASC";
            var calendarList = (await sqlFunction.ExecuteSqlQuery<CalendarModel>(sqlString)).ToList();

            var groupData = calendarList.GroupBy(x => x.CALENDAR_CATEGORY_ID).Select(x => new RootCalendarModel()
            {
                CALENDAR_CATEGORY_ID = x.Key,
                CATEGORY_NAME = x.FirstOrDefault().CATEGORY_NAME,
                CALENDAR_LIST = x.GroupBy(y => y.Id).Select(y => new CalendarModel()
                {
                    CALENDAR_CODE = y.FirstOrDefault().CALENDAR_CODE,
                    CALENDAR_CATEGORY_ID = y.FirstOrDefault().CALENDAR_CATEGORY_ID,
                    CALENDAR_PHOTO_NAME = y.FirstOrDefault().CALENDAR_PHOTO_NAME,
                    CALENDAR_NAME = y.FirstOrDefault().CALENDAR_NAME,
                    CALENDAR_PHOTO_PATH = GetFilepath(y.FirstOrDefault().CALENDAR_PHOTO_PATH, "CALENDAR"),
                    CALENDAR_SUB_CATEGORY_ID = y.FirstOrDefault().CALENDAR_SUB_CATEGORY_ID,
                    CALENDAR_SUB_CATEGORY_NAME = string.Join(",", y.Select(z => z.CALENDAR_SUB_CATEGORY_NAME).ToList()),
                    CATEGORY_NAME = y.FirstOrDefault().CATEGORY_NAME,
                    COMPANY_BANNER_NAME = y.FirstOrDefault().COMPANY_BANNER_NAME,
                    COMPANY_BANNER_PATH = GetFilepath(y.FirstOrDefault().COMPANY_BANNER_PATH, "COMPANY"),
                    COMPANY_CODE = y.FirstOrDefault().COMPANY_CODE,
                    COMPANY_LOGO_NAME = y.FirstOrDefault().COMPANY_LOGO_NAME,
                    COMPANY_LOGO_PATH = GetFilepath(y.FirstOrDefault().COMPANY_LOGO_PATH, "COMPANY"),
                    COMPANY_NAME_CHINESE = y.FirstOrDefault().COMPANY_NAME_CHINESE,
                    COMPANY_NAME_ENGLISH = y.FirstOrDefault().COMPANY_NAME_ENGLISH,
                    created_at = y.FirstOrDefault().created_at,
                    DISTRICT_NAME = y.FirstOrDefault().DISTRICT_NAME,
                    Id = y.FirstOrDefault().Id,
                    IS_FEATURED = y.FirstOrDefault().IS_FEATURED,
                    PAGE_URL = y.FirstOrDefault().PAGE_URL,
                    TAGS = formatTagsString(y.FirstOrDefault().TAGS)
                }).ToList(),
            }).ToList();

            return groupData;
        }
        public async Task<List<CompanyModel>> GetFeatureCompanies()
        {
            string sqlString = $@"select Id,COMPANY_NAME_ENGLISH +'|'+COMPANY_NAME_CHINESE AS COMPANY_NAME,COMPANY_CODE,COMPANY_NAME_ENGLISH,COMPANY_BANNER_PATH,COMPANY_LOGO_PATH,COMPANY_BANNER_NAME,TAGS  from BUSINESS_COMPANY_MASTER_1924 WHERE IS_FEATURED='Y'";
            var featureCompanies = (await sqlFunction.ExecuteSqlQuery<CompanyModel>(sqlString)).ToList();
            featureCompanies.ForEach(x => { x.TAGS = formatTagsString(x.TAGS); x.COMPANY_LOGO_PATH = GetFilepath(x.COMPANY_LOGO_PATH, "COMPANY"); });
            return featureCompanies;
        }

        public async Task<List<BlogModel>> GetFeatureBlogs()
        {
            string sqlString = $@"select blog.Id, blog.created_at, blog.BLOG_TITLE,blog.[IMAGE],blog.YOUTUBE_LINK,blog.TAG,blog_c.BLOG_CATEGORY,blog.BLOG_CATEGORY BLOG_CATEGORY_ID from BLOG_1980 blog
                                  join BLOG_CATEGORY_1981 blog_c on blog.BLOG_CATEGORY=blog_c.Id
                                  where blog.IS_HOT='YES'";
            var featureBlogs = (await sqlFunction.ExecuteSqlQuery<BlogModel>(sqlString)).ToList();
            featureBlogs.ForEach(x => x.TAG = formatTagsString(x.TAG));
            return featureBlogs;
        }

        public async Task<List<CalendarModel>> GetCalendarsSearchResult(SearchAPIModel data, List<string> filters=null)
        {

            data.page = data.page == 0 ? 1 : data.page;
            data.size = data.size == 0 ? 10 : data.size;

            List<string> filterQueryList = filters==null? new List<string>():filters;

            if (data.categoryId > 0)
            {
                filterQueryList.Add(" (category.Id=" + data.categoryId+") ");
            }

            if (data.districtIds != null && data.districtIds.Count()>0)
            {
                string commaSeparatedIds = string.Join(",", data.districtIds);
                filterQueryList.Add(" (calendar.DISTRICT_ID in (" + commaSeparatedIds + ") ) ");
            }

            if (data.subcatIds != null && data.subcatIds.Count()>0)
            {
                    string subcategoryString = " (calendar.[CALENDAR_SUB_CATEGORY_ID] like ";
                    for (int i = 0; i < data.subcatIds.Count(); i++)
                    {
                        if (i == 0)
                        {
                            subcategoryString += "N'%" + data.subcatIds[i] + "%'";
                        }
                        else
                        {
                            subcategoryString += " or calendar.[CALENDAR_SUB_CATEGORY_ID] like N'%" + data.subcatIds[i] + "%'";
                        }
                    }
                    subcategoryString += ") ";
                    filterQueryList.Add(subcategoryString);

                
            }

            if (data.tags != null && data.tags.Count()>0)
            {
                
                    string subcategoryString = " (calendar.[TAGS] like ";
                    for (int i = 0; i < data.tags.Count(); i++)
                    {
                        if (i == 0)
                        {
                            subcategoryString += "N'%" + data.tags[i] + "%'";
                        }
                        else
                        {
                            subcategoryString += " or calendar.[TAGS] like N'%" + data.tags[i] + "%'";
                        }
                    }
                    subcategoryString += ") ";
                    filterQueryList.Add(subcategoryString);
            }

            if (!string.IsNullOrEmpty(data.keyword))
            {
                filterQueryList.Add(" ( calendar.[CALENDAR_NAME] like N'%" + data.keyword + "%') ");
            }

            if (!string.IsNullOrEmpty(data.company_code)) {
                filterQueryList.Add($" (company.COMPANY_CODE='{data.company_code}')");
            }

            string filterQuery = "";
            if (filterQueryList.Count() > 0) { 
            filterQuery= " AND ("+ string.Join(" OR ", filterQueryList)+")";
            }

            string sqlString = $@"declare @PageSize int= {data.size}, 
                                  @PageNumber int= {data.page}; with formdata as 
                                  (SELECT 
                                  calendar.[Id],calendar.[created_at],calendar.[CALENDAR_NAME],calendar.[CALENDAR_PHOTO_NAME],calendar.[CALENDAR_PHOTO_PATH],category.Id AS [CALENDAR_CATEGORY_ID],calendar.[CALENDAR_SUB_CATEGORY_ID],
                                  calendar.[COMPANY_CODE],calendar.[CALENDAR_CODE],STRING_AGG(subCategory.[CALENDAR_SUB_CATEGORY_NAME],', ') as CALENDAR_SUB_CATEGORY_NAME,category.[CMN_CATEGORY_NAME] CATEGORY_NAME,district.[DISTRICT_NAME],calendar.[TAGS],
                                  company.[COMPANY_NAME_ENGLISH],company.[COMPANY_NAME_CHINESE],company.[COMPANY_LOGO_NAME],company.[COMPANY_LOGO_PATH],company.[COMPANY_BANNER_NAME],company.[COMPANY_BANNER_PATH],
                                  company.[PAGE_URL], calendar.[IS_FEATURED],calendar.[SEQUENCE]              
                                  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                  JOIN CALENDAR_COMMON_CATEGORY_1978 category ON category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
                                  left JOIN DISTRICT_MASTER_1928 district ON district.Id = calendar.DISTRICT_ID
                                  JOIN BUSINESS_COMPANY_MASTER_1924 company ON company.COMPANY_CODE = calendar.COMPANY_CODE
								  CROSS APPLY STRING_SPLIT(calendar.CALENDAR_SUB_CATEGORY_ID, ',') s
                                  join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory  ON subCategory.Id=TRY_CAST(s.value AS INT)
                                  WHERE  calendar.STATUS = 'PUBLISH' AND company.IS_ACTIVE = 'Y' AND company.IS_TEMPLATE = 'N' AND calendar.CALENDAR_USE_TYPE = 'PUBLIC' {filterQuery}
                                  group by calendar.[Id],calendar.[created_at],calendar.[CALENDAR_NAME],calendar.[CALENDAR_PHOTO_NAME],calendar.[CALENDAR_PHOTO_PATH],category.Id,calendar.[CALENDAR_SUB_CATEGORY_ID],
                                  calendar.[COMPANY_CODE],calendar.[CALENDAR_CODE],category.[CMN_CATEGORY_NAME],district.[DISTRICT_NAME],calendar.[TAGS],
                                  company.[COMPANY_NAME_ENGLISH],company.[COMPANY_NAME_CHINESE],company.[COMPANY_LOGO_NAME],company.[COMPANY_LOGO_PATH],company.[COMPANY_BANNER_NAME],company.[COMPANY_BANNER_PATH],
                                  company.[PAGE_URL], calendar.[IS_FEATURED],calendar.[SEQUENCE]
								  ) Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata ORDER BY [SEQUENCE] OFFSET @PageSize * (@PageNumber - 1) ROWS 
                                  FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";
            var calendars = (await sqlFunction.ExecuteSqlQuery<CalendarModel>(sqlString)).ToList();
            calendars.ForEach(x => x.TAGS = formatTagsString(x.TAGS));
            return calendars;
        }

        public async Task<List<CompanyModel>> GetCompaniesSearchResult(SearchAPIModel data)
        {
            data.page = data.page == 0 ? 1 : data.page;
            data.size = data.size == 0 ? 10 : data.size;


            List<string> filterQueryList = new List<string>();
            if (data.districtIds != null && data.districtIds.Count()>0)

            {
                string commaSeparatedIds = string.Join(",", data.districtIds);
                filterQueryList.Add(" (DISTRICT_ID in (" + commaSeparatedIds + ") ) ");
            }

            if (data.tags != null && data.tags.Count()>0)
            {
                string subcategoryString = " ([TAGS] like ";
                for (int i = 0; i < data.tags.Count(); i++)
                {
                    if (i == 0)
                    {
                        subcategoryString += "N'%" + data.tags[i] + "%'";
                    }
                    else
                    {
                        subcategoryString += " or [TAGS] like N'%" + data.tags[i] + "%'";
                    }
                }
                subcategoryString += ") ";
                filterQueryList.Add(subcategoryString);

            }
            if (!string.IsNullOrEmpty(data.keyword))
            {

                filterQueryList.Add(" ([COMPANY_NAME_ENGLISH] like N'%" + data.keyword + "%'  or [COMPANY_NAME_CHINESE] like N'%" + data.keyword + "%') ");
            }

            string filterQuery = "";
            if (filterQueryList.Count() > 0)
            {
                filterQuery = " where " + string.Join(" OR ", filterQueryList);
            }

            string sqlString = $@"declare @PageSize int= {data.size}, 
                                  @PageNumber int= {data.page}; with formdata as 
                                  (select Id,COMPANY_NAME_ENGLISH +'|'+COMPANY_NAME_CHINESE AS COMPANY_NAME,COMPANY_CODE,COMPANY_NAME_ENGLISH,COMPANY_BANNER_PATH,COMPANY_LOGO_PATH,COMPANY_BANNER_NAME,TAGS  from BUSINESS_COMPANY_MASTER_1924  {filterQuery}
                                  ) Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata ORDER BY Id OFFSET @PageSize * (@PageNumber - 1) ROWS 
                                  FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";
            var companies = (await sqlFunction.ExecuteSqlQuery<CompanyModel>(sqlString)).ToList();
            companies.ForEach(x => { x.TAGS = formatTagsString(x.TAGS); x.COMPANY_LOGO_PATH = GetFilepath(x.COMPANY_LOGO_PATH, "COMPANY"); });
            return companies;
        }

        public async Task<List<BlogModel>> GetBlogsSearchResult(SearchAPIModel data)
        {
            data.page = data.page == 0 ? 1 : data.page;
            data.size = data.size == 0 ? 10 : data.size;
            List<string> filterQueryList = new List<string>();

            if (data.tags.Count() > 0 && data.tags[0] != "" && data.tags[0] != "string")
            {
                string subcategoryString = " ([TAG] like ";
                for (int i = 0; i < data.tags.Count(); i++)
                {
                    if (i == 0)
                    {
                        subcategoryString += "N'%" + data.tags[i] + "%'";
                    }
                    else
                    {
                        subcategoryString += " or [TAG] like N'%" + data.tags[i] + "%'";
                    }
                }
                subcategoryString += ") ";
                filterQueryList.Add(subcategoryString);
            }

            if (!string.IsNullOrEmpty(data.keyword))
            {
                filterQueryList.Add(" (blog.BLOG_TITLE like N'%" + data.keyword + "%') ");
            }
            string filterQuery = "";
            if (filterQueryList.Count() > 0)
            {
                filterQuery = " where " + string.Join(" OR ", filterQueryList);
            }


            string sqlString = $@"declare @PageSize int= {data.size}, 
                                  @PageNumber int= {data.page}; with formdata as 
                                  (select blog.Id, blog.created_at, blog.BLOG_TITLE,blog.[IMAGE],blog.YOUTUBE_LINK,blog.TAG,blog_c.BLOG_CATEGORY,blog.BLOG_CATEGORY BLOG_CATEGORY_ID from BLOG_1980 blog
                                  join BLOG_CATEGORY_1981 blog_c on blog.BLOG_CATEGORY=blog_c.Id  {filterQuery}
                                  ) Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata ORDER BY Id OFFSET @PageSize * (@PageNumber - 1) ROWS 
                                  FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";
            var blogs = (await sqlFunction.ExecuteSqlQuery<BlogModel>(sqlString)).ToList();
            blogs.ForEach(x => x.TAG = formatTagsString(x.TAG));
            return blogs;
        }
        public async Task<Company> GetCompany(string companyCode)
        {
            string query = $@"SELECT company.[Id], company.[IS_TEMPLATE], company.TEMPLATE_ID,company.Latitude,company.Longitude, company.PALETTE_ID, 
                                country.COUNTRY_NAME as 'COMPANY_COUNTRY_NAME', city.CITY_NAME as 'COMPANY_CITY_NAME', district.DISTRICT_NAME as 'COMPANY_DISTRICT_NAME'     ,
                                company.[created_at]      ,company.[updated_at]     ,[BUSINESS_ACCOUNT_ID]      ,[COMPANY_CODE]      ,[COMPANY_NAME_ENGLISH]      ,
                                [COMPANY_NAME_CHINESE]      ,[COMPANY_LOGO_NAME]      ,[COMPANY_LOGO_PATH]      ,[COMPANY_BANNER_NAME]      ,[COMPANY_BANNER_PATH]      ,[COMPANY_PHONE]      ,[COMPANY_ADDRESS]      ,
                                [FACEBOOK_URL]      ,[INSTAGRAM_URL]      ,[WECHAT_URL]      ,[TWITTER_URL]      ,[PAGE_URL]      ,[COMPANY_DESCRIPTION]      ,[COMPANY_SERVICE]      ,[TAGS]      ,[IS_SEARCHABLE_IN_MARKETPLACE]      ,
                                [COMPANY_EMAIL]      ,company.[COUNTRY_ID]      ,company.[CITY_ID]      ,[DISTRICT_ID]      ,[TOTAL_WEBSITE_VISITS]      ,[IS_DEFAULT],[IS_ACTIVE]  
                                FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                left join COUNTRY_MASTER_1926 country on country.Id = company.COUNTRY_ID
                                left join CITY_MASTER_1927 city on city.Id = company.CITY_ID
                                left join DISTRICT_MASTER_1928 district on district.Id = company.DISTRICT_ID
                                where IS_ACTIVE = 'Y' and  COMPANY_CODE = '{companyCode}'";

            var BusinessCompanyResult = (await sqlFunction.ExecuteSqlQuery<Company>(query)).ToList();

            if (BusinessCompanyResult.Count > 0)
            {
                var company = BusinessCompanyResult.FirstOrDefault();

                string filter = $" (company.COMPANY_CODE='{companyCode}')";
                var calendars = await GetCalendarsSearchResult(new SearchAPIModel() { size=100}, new List<string>() { filter });

                List<string> subCategories = new List<string>();
                List<string> categories = new List<string>();
                calendars.ForEach(calendar =>
                {
                    if (calendar.CATEGORY_NAME != null) categories.Add(calendar.CATEGORY_NAME);

                    if (calendar.CALENDAR_SUB_CATEGORY_NAME != null) subCategories.AddRange(calendar.CALENDAR_SUB_CATEGORY_NAME.Split(',').Select(x=>x.Trim()).ToList());
                });

                company.CATEGORIES = categories.Distinct().ToList();
                company.SUB_CATEGORIES = subCategories.Distinct().ToList();
                company.TAGS= formatTagsString(company.TAGS);
                company.COMPANY_LOGO_PATH = GetFilepath(company.COMPANY_LOGO_PATH, "COMPANY");
                company.COMPANY_BANNER_PATH = GetFilepath(company.COMPANY_BANNER_PATH, "COMPANY_BANNER");
                return BusinessCompanyResult.FirstOrDefault();
            }
            else
            {
                return null;
            }
        }

        public async Task<List<ServiceList>> GetCompanyServiceList(string code)
        {
            string query = $@"select Id,ACTIVITY_NAME,DESCRIPTION,(select isnull(ROUND(AVG(REVIEW_SCORE), 2),0) from SESSION_REVIEWS_1983 where CALENDAR_CODE=Sm.CALENDAR_CODE) as REVIEW_SCORE from SERVICE_MASTER_1933  where COMPANY_CODE='{code}'";
            var serviceList = (await sqlFunction.ExecuteSqlQuery<ServiceList>(query)).ToList();
            return serviceList;
        }



        public async Task<List<PhotoGalleryModel>> GetCompanyPhotoGallery(string code)
        {
            string query = $@"SELECT cmp.[Id],[ALBUM_PHOTO_NAME],[ALBUM_PHOTO_PATH]
							FROM [dbo].[BUSINESS_PHOTO_ALBUM_1922] ph 
							join [dbo].[BUSINESS_COMPANY_MASTER_1924] cmp on cmp.Id=ph.COMPANY_ID 
							where cmp.COMPANY_CODE ='CMP00084' and ph.IS_VISIBLE='Y'";
            var result = (await sqlFunction.ExecuteSqlQuery<PhotoGalleryModel>(query)).ToList();
            result.ForEach(x => x.ALBUM_PHOTO_PATH = GetFilepath(x.ALBUM_PHOTO_PATH));
            return result;
        }



        public async Task<Dictionary<string, List<IDictionary<string, object>>>> GetCompanyCalendarPackages(string code)
        {
            string query = $@"select * from CALENDAR_PACKAGE_MASTER_1952 
                            where COMPANY_CODE = '{code}' and IS_ACTIVE = 'Y'
                            order by PACKAGE_SEQUENCE, created_at";
            List<IDictionary<string, object>> packageResult = await sqlFunction.ExecuteSqlQuery(query);

            query = $@"select STUFF((SELECT ',' + '''' + convert(nvarchar, f2.CALENDAR_CODE) + '''' from CALENDAR_PACKAGE_MASTER_1952 f2    
                                                                where f2.COMPANY_CODE = '{code}'   FOR XML PATH('')), 1, 1, '') as 'CalendarCodes'";
            var calendarCodesResult = await sqlFunction.ExecuteSqlQuery(query);

            query = $@"
                                IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END;
                                with cte2 as (
                                 select distinct  f.*,
	                                f.resources 'resourceId',
	                                bcm.CALENDAR_NAME,
	                                subCategory.CALENDAR_SUB_CATEGORY_NAME,
									bcm.CALENDAR_PHOTO_PATH
	                                from CALENDAR_FORM_1935 f  
	                                join BUSINESS_CALENDAR_MASTER_1925 bcm on bcm.CALENDAR_CODE = f.CALENDAR_CODE
	                                join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory   ON ',' +  bcm.CALENDAR_SUB_CATEGORY_ID + ',' LIKE '%,' + CAST(subCategory.Id AS NVARCHAR(MAX)) + ',%'
	                                where   f.formid=2305 and f.CALENDAR_CODE {(!string.IsNullOrEmpty(calendarCodesResult[0]["CalendarCodes"].ToString()) ? " in (" + calendarCodesResult[0]["CalendarCodes"].ToString() + ")" : "= ''")}
                                )
                                select* into #temptable from cte2
                               
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
								
								from #temptable cf";


            List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);
            Dictionary<string, List<IDictionary<string, object>>> response = new Dictionary<string, List<IDictionary<string, object>>>() {
                                                                             { "calendarList",result},{ "packageList",packageResult } };
            return response;
        }



        public static List<IDictionary<string, object>> RemoveDuplicates(List<IDictionary<string, object>> list, string key)
        {

            HashSet<object> hashSet = new HashSet<object>();
            return list.Where(dict => { var value = dict[key]; return hashSet.Add(value); }).ToList();
        }


        private string formatTagsString(string json)
        {

            if (!string.IsNullOrEmpty(json) && isJsonString(json))
            {
                JArray jsonArray = JArray.Parse(json);
                // Extract "value" properties and join them into a comma-separated string
                string result = string.Join(",", jsonArray
                    .Where(j => j["value"] != null) // Check if "value" property exists
                    .Select(j => j["value"].ToString()));
                return result;
            }
            return json;
        }
        private bool isJsonString(string json)
        {
            try
            {
                var parse_json = JsonConvert.DeserializeObject<List<IDictionary<string, object>>>(json);
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }

        }
        private string GetFilepath(string path, string type="")
        {

            if (!string.IsNullOrEmpty(path) && path.Contains("/"))
            {
                path = path.Replace("~", "");
                path = baseUrl + path;
                return path;
            }
            else
            {
               
                switch (type) {

                    case "COMPANY": path = AppSettings.default_company_logopath; break;
                    case "COMPANY_BANNER": path = AppSettings.default_company_bannerpath; break;
                    case "CALENDAR": path = AppSettings.default_calernar_path; break;
                    default: break;
                }
                return path;
            }
        }

        
    }
}
