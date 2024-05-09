
using AutoMapper;
using Barrway.DTO.APIModels.Calendar;
using Barrway.DTO.APIModels.Booking;
using Barrway.DTO.APIModels.Company;
using Barrway.DTO.APIModels.Dashboard;
using Barrway.DTO.APIModels.SearchAPI;

using Barrway.DTO.Common;
using Barrway.DTO.FormAPI;
using Barrway.Service.IRepository;
using Barrway.Utility.Common;
using FormGeneratorDTOs.DTOs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twilio.TwiML.Voice;

namespace Barrway.Service.Repository
{
    public class MobileAPIService : IMobileAPIService
    {
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly IMapper mapper;
        private readonly string baseUrl = ConfigurationManager.AppSettings["baseurl"];

        public MobileAPIService(ISqlFunction sqlFunction, IFormAPIRepository formAPIRepository, IMapper mapper)
        {
            this.sqlFunction = sqlFunction;
            this.formAPIRepository = formAPIRepository;
            this.mapper = mapper;
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

        public async Task<List<CalendarModel>> GetCalendarsSearchResult(SearchAPIModel data, List<string> filters = null)
        {

            data.page = data.page == 0 ? 1 : data.page;
            data.size = data.size == 0 ? 10 : data.size;

            List<string> filterQueryList = filters == null ? new List<string>() : filters;

            if (data.categoryId > 0)
            {
                filterQueryList.Add(" (category.Id=" + data.categoryId + ") ");
            }

            if (data.districtIds != null && data.districtIds.Count() > 0)
            {
                string commaSeparatedIds = string.Join(",", data.districtIds);
                filterQueryList.Add(" (calendar.DISTRICT_ID in (" + commaSeparatedIds + ") ) ");
            }

            if (data.subcatIds != null && data.subcatIds.Count() > 0)
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

            if (data.tags != null && data.tags.Count() > 0)
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

            if (!string.IsNullOrEmpty(data.company_code))
            {
                filterQueryList.Add($" (company.COMPANY_CODE='{data.company_code}')");
            }

            string filterQuery = "";
            if (filterQueryList.Count() > 0)
            {
                filterQuery = " AND (" + string.Join(" OR ", filterQueryList) + ")";
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

        public async Task<List<CompanyModel>> GetCompaniesSearchResult(CompanySearchApiModel data)
        {
            data.page = data.page == 0 ? 1 : data.page;
            data.size = data.size == 0 ? 10 : data.size;


            List<string> filterQueryList = new List<string>();
            if (data.districtIds != null && data.districtIds.Count() > 0)

            {
                string commaSeparatedIds = string.Join(",", data.districtIds);
                filterQueryList.Add(" (DISTRICT_ID in (" + commaSeparatedIds + ") ) ");
            }

            if (data.tags != null && data.tags.Count() > 0)
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

        public async Task<List<BlogModel>> GetBlogsSearchResult(BlogSearchAPIModel data)
        {
            data.page = data.page == 0 ? 1 : data.page;
            data.size = data.size == 0 ? 10 : data.size;
            List<string> filterQueryList = new List<string>();

            if (data.tags != null && data.tags.Count() > 0)
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
                var calendars = await GetCalendarsSearchResult(new SearchAPIModel() { size = 100 }, new List<string>() { filter });

                List<string> subCategories = new List<string>();
                List<string> categories = new List<string>();
                calendars.ForEach(calendar =>
                {
                    if (calendar.CATEGORY_NAME != null) categories.Add(calendar.CATEGORY_NAME);

                    if (calendar.CALENDAR_SUB_CATEGORY_NAME != null) subCategories.AddRange(calendar.CALENDAR_SUB_CATEGORY_NAME.Split(',').Select(x => x.Trim()).ToList());
                });

                company.CATEGORIES = categories.Distinct().ToList();
                company.SUB_CATEGORIES = subCategories.Distinct().ToList();
                company.TAGS = formatTagsString(company.TAGS);
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
            string query = $@"select Id,ACTIVITY_NAME,DESCRIPTION,(select isnull(ROUND(AVG(REVIEW_SCORE), 2),0) from SESSION_REVIEWS_1983 where CALENDAR_CODE=sm.CALENDAR_CODE) as REVIEW_SCORE from SERVICE_MASTER_1933 sm  where COMPANY_CODE='{code}'";
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



        public async Task<companyPackage> GetCompanyCalendarPackages(string code)
        {

            string query = $@"SELECT * FROM CALENDAR_PACKAGE_MASTER_1952 
                  WHERE COMPANY_CODE = '{code}' AND IS_ACTIVE = 'Y'
                  ORDER BY PACKAGE_SEQUENCE, created_at";
            var packageResult = await sqlFunction.ExecuteSqlQuery<Packagemaster>(query);

            query = $@"select STUFF((SELECT ',' + '''' + convert(nvarchar, f2.CALENDAR_CODE) + '''' from CALENDAR_PACKAGE_MASTER_1952 f2 where f2.COMPANY_CODE = '{code}'   FOR XML PATH('')), 1, 1, '') as 'CalendarCodes'";
            var calendarCodesResult = await sqlFunction.ExecuteSqlQuery(query);

            query = $@" IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END;
                                with cte2 as (select distinct  f.*,f.resources 'resourceId',bcm.CALENDAR_NAME,subCategory.CALENDAR_SUB_CATEGORY_NAME,bcm.CALENDAR_PHOTO_PATH
	                                from CALENDAR_FORM_1935 f join BUSINESS_CALENDAR_MASTER_1925 bcm on bcm.CALENDAR_CODE = f.CALENDAR_CODE
	                                join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory   ON ',' +  bcm.CALENDAR_SUB_CATEGORY_ID + ',' LIKE '%,' + CAST(subCategory.Id AS NVARCHAR(MAX)) + ',%'
	                                where   f.formid=2305 and f.CALENDAR_CODE {(!string.IsNullOrEmpty(calendarCodesResult[0]["CalendarCodes"].ToString()) ? " in (" + calendarCodesResult[0]["CalendarCodes"].ToString() + ")" : "= ''")}
                                )
                                select* into #temptable from cte2                               
								select distinct cf.CALENDAR_SUB_CATEGORY_NAME, cf.CALENDAR_NAME, cf.CALENDAR_CODE, cf.CALENDAR_PHOTO_PATH,
								STUFF((SELECT ', ' + R.ACTIVITY_NAME FROM SERVICE_MASTER_1933 AS R WHERE Id in (SELECT CAST(Item AS INTEGER) as Ids
                                        FROM dbo.SplitString((STUFF((SELECT distinct ','+ f.activities from CALENDAR_FORM_1935 f  where f.formid=2305 and f.CALENDAR_CODE = cf.CALENDAR_CODE   FOR XML PATH('')), 1, 1, '')) , ',')  ) FOR XML PATH('') ) ,1,1,'') as ActivityName 					
								from #temptable cf";
            var result = await sqlFunction.ExecuteSqlQuery<CalanderService>(query);

            var response = new companyPackage
            {
                PackageList = (List<Packagemaster>)packageResult,
                SERVICE_LIST = (List<CalanderService>)result
            };
            response.SERVICE_LIST.ForEach(x => x.CALENDAR_PHOTO_PATH = GetFilepath(x.CALENDAR_PHOTO_PATH));
            return response;
        }







        public async Task<List<ModifiedMyBooking>> GetMyBookings(MyBookingApiModel modelstring, string email, string Type, string EventId = null)
        {

            modelstring.page = modelstring.page == 0 ? 1 : modelstring.page;
            modelstring.size = modelstring.size == 0 ? 10 : modelstring.size;
            string sqlString = $@"DECLARE @retval nvarchar(max);       DECLARE @sQuery nvarchar(max); DECLARE @ParmDefinition nvarchar(max);                        
                                    DECLARE @customTitleQuery nvarchar(max);
                                    declare @PageSize int={modelstring.size};
                                    declare @PageNumber int={modelstring.page};

                                    IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END 
                                    ;with cte1 as( select distinct  f.*,f.resources 'resourceId', transaction_m.Id as 'TransactionId', company.COMPANY_LOGO_PATH, company.Id as 'COMPANY_ID', company.COMPANY_NAME_ENGLISH ,  STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                                    from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle
                                    , (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,   (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                                    where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) customForms  , (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) 
                                    from form_calenderreferrence f2    where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) customFormIds,  '' referrences_1,  '' referrences_2,  '' referrences_3 
                                    , (select case when (cast(getdate() as datetime) >= cast((DATEADD(minute, -30, f.[start])) as datetime) and cast(getdate() as datetime) <= cast(f.[end] as datetime) ) then 'Y' else 'N' end) as 'ATTEND'
                                    , case when review.Id is null then 'N' else 'Y' end as 'SESSION_REVIEWED'
									, review.REVIEW_SCORE
									, review.REVIEW_COMMENT
									, transaction_m.ATTENDANCE
									, calendar.CALENDAR_NAME
									from CALENDAR_FORM_1935 f 
                                    join TRANSACTION_MASTER_1942 transaction_m on transaction_m.CALENDAR_CODE = f.CALENDAR_CODE
                                    join PARTICIPANT_MASTER_1940 participant_m on participant_m.Id = transaction_m.STUDENT
									join BUSINESS_CALENDAR_MASTER_1925 calendar on calendar.CALENDAR_CODE = f.CALENDAR_CODE
                                    join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = f.COMPANY_CODE
									left join SESSION_REVIEWS_1983 review on review.EVENT_ID = transaction_m.SLOT and review.USER_EMAIL = participant_m.EMAIL
                                    where 
                                    {((Type == "1") ? $@"'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' <= cast(f.[start] as datetime)" : $@"'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' > cast(f.[end] as datetime)")}
                                    and f.formid=2305 and participant_m.EMAIL = '{email}' and transaction_m.SLOT = f.Id {((!string.IsNullOrEmpty(EventId) ? $@" and f.Id = '{EventId}'" : ""))}
                                    ) ,
                                    
                                     cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER ,COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page', * from cte1	 where len(customtitle)>0  ORDER BY Id OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY)
                                    

                                    select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= (select min(ROWNUMBER) from #temptable);   
                                    select @counter = (select max(ROWNUMBER) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                                    SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';   
                                    EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT; update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end  select* from #temptable order by cast([start] as datetime) desc";

            var MyBooking = (await sqlFunction.ExecuteSqlQuery<MyBooking>(sqlString)).ToList();
            if (MyBooking.Any())
            {
                var modifiedData = modifiedDataUpcomingEvent(MyBooking);
                modifiedData.ForEach(x =>
                {

                    x.COMPANY_LOGO_PATH = GetFilepath(x.COMPANY_LOGO_PATH);
                    if (x.DOWNLOAD_FILE_LIST != null && x.DOWNLOAD_FILE_LIST is string downloadFileListString)
                    {
                        x.DOWNLOAD_FILE_LIST = JsonConvert.DeserializeObject<dynamic[]>(x.DOWNLOAD_FILE_LIST.ToString());
                        //x.DOWNLOAD_FILE_LIST = JsonConvert.DeserializeObject<DownloadFile>(x.DOWNLOAD_FILE_LIST.ToString());
                        // x.DOWNLOAD_FILE_LIST = JsonConvert.DeserializeObject<List<DownloadFile>>(JsonConvert.SerializeObject(x.DOWNLOAD_FILE_LIST));
                    }
                    else
                    {
                        x.DOWNLOAD_FILE_LIST = new List<DownloadFile>();
                    }
                });


                return modifiedData;
            }
            else
            {
                return new List<ModifiedMyBooking>();
            }

        }


        private List<ModifiedMyBooking> modifiedDataUpcomingEvent(List<MyBooking> data)
        {
            List<ModifiedMyBooking> modifiedData = new List<ModifiedMyBooking>();
            data.ForEach(x => modifiedData.Add(ModifiedMasterData(x)));
            return modifiedData;
        }

        private ModifiedMyBooking ModifiedMasterData(MyBooking booking)
        {
            ModifiedMyBooking modifiedBooking = new ModifiedMyBooking
            {


                ROWNUMBER = booking.ROWNUMBER,
                total_records = booking.total_records,
                size = booking.size,
                page = booking.page,
                Id = booking.Id,
                formGroupKey = booking.formGroupKey,
                formID = booking.formID,
                userID = booking.userID,
                Current_Status = booking.Current_Status,
                cycle = booking.cycle,
                MasterFormID = booking.MasterFormID,
                MasterFormRow = booking.MasterFormRow,
                formRecordOrder = booking.formRecordOrder,
                formRecordStatus = booking.formRecordStatus,
                ApprovalStatus = booking.ApprovalStatus,
                COMPANY_CODE = booking.COMPANY_CODE,
                CALENDAR_CODE = booking.CALENDAR_CODE,
                hidden_fullcalendar = booking.hidden_fullcalendar,
                schedulerformgroupkey = booking.schedulerformgroupkey,
                title = booking.title,
                start = booking.start,
                end = booking.end,
                allDay = booking.allDay,
                resources = booking.resources,
                activities = booking.activities,
                description = booking.description,
                color = booking.color,
                created_at = booking.created_at,
                updated_at = booking.updated_at,
                created_by = booking.created_by,
                updated_by = booking.updated_by,
                resForm_2304 = booking.updated_by,
                actFormID = booking.updated_by,
                parentID = booking.updated_by,
                seperatedFormIDs = booking.updated_by,
                seperatedTitles = booking.updated_by,
                seperatedIds = booking.updated_by,
                seperatedResFormIDs = booking.updated_by,
                seperatedResEntryIDs = booking.updated_by,
                seperatedResColValues = booking.updated_by,
                seperatedColorValues = booking.updated_by,
                tabulator_1683726769059 = booking.updated_by,
                tabulator_1683785383381 = booking.updated_by,
                SCHEDULAR_FORM_ID = booking.SCHEDULAR_FORM_ID,
                CREATION_TYPE = booking.CREATION_TYPE,
                SLOT_DURATION_IN_MINS = booking.SLOT_DURATION_IN_MINS,
                EVENT_TYPE = booking.EVENT_TYPE,
                COMPANY_SUBSCRIPTION_ID = booking.COMPANY_SUBSCRIPTION_ID,
                IS_UPLOAD_REQUIRED = booking.IS_UPLOAD_REQUIRED,
                UPLOAD_TIME = booking.UPLOAD_TIME,
                DOWNLOADABLE_ATTACHMENT = booking.DOWNLOADABLE_ATTACHMENT,
                DOWNLOAD_FILE_LIST = booking.DOWNLOAD_FILE_LIST,
                IS_COURSE_EVENT = booking.IS_COURSE_EVENT,
                resourceId = booking.resourceId,
                TransactionId = booking.TransactionId,
                COMPANY_LOGO_PATH = booking.COMPANY_LOGO_PATH,
                COMPANY_ID = booking.COMPANY_ID,
                COMPANY_NAME_ENGLISH = booking.COMPANY_NAME_ENGLISH,
                customFourthTitle = booking.customFourthTitle,
                customTitle = booking.customTitle,
                customForms = booking.customForms,
                customFormIds = booking.customFormIds,
                referrences_1 = booking.referrences_1,
                referrences_2 = booking.referrences_2,
                referrences_3 = booking.referrences_3,
                ATTEND = booking.ATTEND,
                SESSION_REVIEWED = booking.SESSION_REVIEWED,
                REVIEW_SCORE = booking.REVIEW_SCORE,
                REVIEW_COMMENT = booking.REVIEW_COMMENT,
                ATTENDANCE = booking.ATTENDANCE,
                CALENDAR_NAME = booking.CALENDAR_NAME,
                SERVICE_PROVIDER_TITLE = booking.SERVICE_PROVIDER_TITLE,
                SERVICE_PROVIDER_ID = booking.SERVICE_PROVIDER_ID,
                SERVICE_PROVIDER_FORMID = booking.SERVICE_PROVIDER_FORMID,
                SERVICE_TITLE = booking.SERVICE_TITLE,
                SERVICE_ID = booking.SERVICE_ID,
                SERVICE_FORMID = booking.SERVICE_FORMID,
                LOCATION_TITLE = booking.LOCATION_TITLE,
                LOCATION_ID = booking.LOCATION_ID,
                LOCATION_FORMID = booking.LOCATION_FORMID
            };

            string customForms = booking.customForms;
            string customFormIds = booking.customFormIds;
            string customTitle = booking.customTitle;

            if (string.IsNullOrEmpty(customForms) || string.IsNullOrEmpty(customFormIds) || string.IsNullOrEmpty(customTitle))
            {
                return modifiedBooking;
            }




            string[] customFormsSplit = customForms.Split(',');
            string[] customFormIdsSplit = customFormIds.Split(',');
            string[] customTitleSplit = customTitle.Split(',');

            for (int i = 0; i < customFormsSplit.Length; i++)
            {
                switch (customFormsSplit[i])
                {
                    case "2303":
                        modifiedBooking.SERVICE_TITLE = customTitleSplit[i];
                        modifiedBooking.SERVICE_ID = customFormIdsSplit[i];
                        modifiedBooking.SERVICE_FORMID = customFormsSplit[i];
                        break;
                    case "2304":
                        modifiedBooking.SERVICE_PROVIDER_TITLE = customTitleSplit[i];
                        modifiedBooking.SERVICE_PROVIDER_ID = customFormIdsSplit[i];
                        modifiedBooking.SERVICE_PROVIDER_FORMID = customFormsSplit[i];
                        break;
                    case "2306":
                        modifiedBooking.LOCATION_TITLE = customTitleSplit[i];
                        modifiedBooking.LOCATION_ID = customFormIdsSplit[i];
                        modifiedBooking.LOCATION_FORMID = customFormsSplit[i];
                        break;
                    default:
                        break;
                }
            }

            return modifiedBooking;
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
        private string GetFilepath(string path, string type = "")
        {

            if (!string.IsNullOrEmpty(path) && path.Contains("/"))
            {
                path = path.Replace("~", "");
                path = baseUrl + path;
                return path;
            }
            else
            {

                switch (type)
                {

                    case "COMPANY": path = AppSettings.default_company_logopath; break;
                    case "COMPANY_BANNER": path = AppSettings.default_company_bannerpath; break;
                    case "CALENDAR": path = AppSettings.default_calernar_path; break;
                    default: break;
                }
                return path;
            }
        }




        #region calendar service
        public async Task<List<IDictionary<string, object>>> GetEvents(CalendarRequestModel calendarRequest)
        {

            Form_DataTable data = mapper.Map<Form_DataTable>(calendarRequest);
            data.action = 1;
            data.ActivityFormId = (int)FormSetting.SERVICE_MASTER;
            data.resourceFormId = (int)FormSetting.LOCATION_MASTER;
            data.isEvent = 1;
            data.isCalender = 1;
            data.formId = (int)FormSetting.CALENDAR_FORM;
            string filterQuery = GetDateQuery(calendarRequest.start, calendarRequest.end);
            data.filter = new FilterDTO() { field = "start", value = filterQuery + " and F.COMPANY_CODE=N'" + calendarRequest.COMPANY_CODE + "' and F.CALENDAR_CODE=N'" + calendarRequest.CALENDAR_CODE + "'" };

            ReferalFormDataResponseModel result = await formAPIRepository.getReferralFormFields(data);

            if (result != null && result.events != null)
            {
                return result.events;
            }
            return new List<IDictionary<string, object>>();
        }


        public async Task<List<MyFavouriteCompany>> GetMyfavoriteCompanyList(string userName)
        {
            try
            {

                string query = $@"declare @CompanyCodes varchar(max) = (select stuff((select distinct ',' + COMPANY_CODE  from PAYMENT_HISTORY_MASTER_1956 payment 
											  where payment.STATUS = 'complete' and payment.USER_ID = '{userName}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd")}' < payment.CREDIT_EXPIRE_DATE
											  for xml path('')), 1, 1, '')) 

											  SELECT distinct company.[COMPANY_CODE],company.[Id]
												,[COMPANY_NAME_ENGLISH] as COMPANY_NAME
												FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
												where company.COMPANY_CODE in (select cast(item as varchar) from dbo.SplitString(@CompanyCodes, ','))
                                            Union all
									  SELECT distinct company.[COMPANY_CODE],company.[Id]
                                          ,[COMPANY_NAME_ENGLISH] as COMPANY_NAME
                                      FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company
                                      join FAVORITE_CALENDAR_MASTER_1949 favorite on favorite.COMPANY_CODE = company.COMPANY_CODE
                                      where favorite.USER_ID = '{userName}' and company.COMPANY_CODE not in (select cast(item as varchar) from dbo.SplitString(@CompanyCodes, ','))";

                var result = (await sqlFunction.ExecuteSqlQuery<MyFavouriteCompany>(query)).ToList();
                if (result.Any())
                {
                    return result;
                }
                else
                {
                    return new List<MyFavouriteCompany>();
                }

            }
            catch (Exception ex)
            {
                return new List<MyFavouriteCompany>();
            }
        }



        public async Task<List<FavouriteCalendar>> GetMyFavoriteCalendars(FavouriteClanderData data, string userId)
        {
            try
            {

                string CompanyLogic = "";

                string Fev_query = $@"SELECT [Id],[created_at],[updated_at],[created_by],[updated_by],[COMPANY_CODE],[CALENDAR_CODE],[USER_ID],[IS_PUBIC_USER] FROM [dbo].[FAVORITE_CALENDAR_MASTER_1949] calendarDetails where USER_ID = '{userId}' {CompanyLogic} ";

                List<IDictionary<string, object>> Fev_result = await sqlFunction.ExecuteSqlQuery(Fev_query);

                string calendarCodes = "";

                string CompanyCodestring = "";

                if (Fev_result.Count > 0)
                {
                    for (int i = 0; i < Fev_result.Count; i++)
                    {
                        if (i == Fev_result.Count - 1)
                        {
                            calendarCodes += "'" + Fev_result[i]["CALENDAR_CODE"].ToString() + "'";
                        }
                        else
                        {
                            calendarCodes += "'" + Fev_result[i]["CALENDAR_CODE"].ToString() + "'" + ", ";
                        }
                    }
                }

                if (!string.IsNullOrEmpty(data.CalendarCode))
                {
                    calendarCodes = (data.CalendarCode.Contains("'")) ? data.CalendarCode : "'" + data.CalendarCode + "'";
                }


                if (!string.IsNullOrEmpty(data.COMPANY_CODE))
                {
                    CompanyCodestring = " and calendarDetails.[COMPANY_CODE]='"+ data.COMPANY_CODE + "'";
                }

                int PageSize = data.size > 0 ? data.size : 20;
                int PageNumber = data.page > 0 ? data.page : 1;

                string query = $@"declare @CalendarCodes varchar(max) = (select stuff((select distinct ',' + CALENDAR_CODE  from PAYMENT_HISTORY_MASTER_1956 payment 
											  where payment.STATUS = 'complete' and payment.USER_ID = '{userId}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd")}' < payment.CREDIT_EXPIRE_DATE
											  for xml path('')), 1, 1, '')) 
                                  declare @PageSize int={PageSize} ,  @PageNumber int={PageNumber} ; with formdata as (
                                              

                                              SELECT distinct calendarDetails.[COMPANY_CODE]
                                                  ,calendarDetails.[CALENDAR_CODE]
	                                              ,calendarDetails.[Id] 
                                                  ,calendarDetails.[created_at] 
                                                  ,company.Id as 'CompanyId'
                                                  ,calendarDetails.[CALENDAR_NAME]
                                                  ,calendarDetails.[CALENDAR_PHOTO_NAME]
                                                  ,calendarDetails.[CALENDAR_PHOTO_PATH]
                                                  ,calendarDetails.[CALENDAR_CATEGORY_ID]
                                                  ,calendarDetails.[CALENDAR_SUB_CATEGORY_ID]
                                                  ,calendarDetails.[TAGS]
	                                              ,company.COMPANY_NAME_ENGLISH
                                                  ,company.COMPANY_LOGO_PATH
                                                  ,subCategory.CALENDAR_SUB_CATEGORY_NAME
												  ,(select  case when (
		                                                        (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = '{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN)
	                                                        ) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = '{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN) <= 0
	                                                        then
		                                                        0
	                                                        else
		                                                        (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = '{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE)
	                                                        end
                                                        FROM LEDGER_MASTER_1957 led 
                                                        join ORDER_MASTER_1969 ord on ord.ORDER_NO = led.ORDER_NO
                                                        where ord.ORDER_TYPE = 'PACKAGE' and led.USER_ID = '{userId}' and led.CALENDAR_CODE = calendarDetails.CALENDAR_CODE ) as 'COIN_BALANCE', 'Y' as 'PURCHASED'
                                              FROM [dbo].BUSINESS_CALENDAR_MASTER_1925 calendarDetails
                                              join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendarDetails.COMPANY_CODE
								              join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory ON ',' + calendarDetails.CALENDAR_SUB_CATEGORY_ID + ',' LIKE '%,' + CAST(subCategory.Id AS NVARCHAR(MAX)) + ',%'
											  where calendarDetails.CALENDAR_CODE in (select cast(item as varchar) from dbo.SplitString(@CalendarCodes, ',')) {CompanyLogic}
                                              Union all
                                              SELECT distinct calendarDetails.[COMPANY_CODE]
                                                  ,calendarDetails.[CALENDAR_CODE]
	                                              ,calendarDetails.[Id] 
                                                  ,calendarDetails.[created_at] 
                                                  ,company.Id as 'CompanyId'
                                                  ,calendarDetails.[CALENDAR_NAME]
                                                  ,calendarDetails.[CALENDAR_PHOTO_NAME]
                                                  ,calendarDetails.[CALENDAR_PHOTO_PATH]
                                                  ,calendarDetails.[CALENDAR_CATEGORY_ID]
                                                  ,calendarDetails.[CALENDAR_SUB_CATEGORY_ID]
                                                  ,calendarDetails.[TAGS]
	                                              ,company.COMPANY_NAME_ENGLISH
                                                  ,company.COMPANY_LOGO_PATH
                                                  ,subCategory.CALENDAR_SUB_CATEGORY_NAME
                                                  ,0 as 'COIN_BALANCE'
                                                  ,'N' as 'PURCHASED'
                                              FROM [dbo].BUSINESS_CALENDAR_MASTER_1925 calendarDetails
                                              join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendarDetails.COMPANY_CODE
								              join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory ON ',' + calendarDetails.CALENDAR_SUB_CATEGORY_ID + ',' LIKE '%,' + CAST(subCategory.Id AS NVARCHAR(MAX)) + ',%'
                                              where {((string.IsNullOrEmpty(calendarCodes)) ? "calendarDetails.CALENDAR_CODE = ''" : $@"calendarDetails.CALENDAR_CODE in ({calendarCodes})")} and calendarDetails.CALENDAR_CODE not in (select cast(item as varchar) from dbo.SplitString(@CalendarCodes, ','))  {CompanyCodestring}
                                      )
                                  Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY PURCHASED desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";


                var result = (await sqlFunction.ExecuteSqlQuery<FavouriteCalendar>(query)).ToList();
                if (result.Any())
                {
                    result.ForEach(x =>
                    {
                        x.COMPANY_LOGO_PATH = GetFilepath(x.COMPANY_LOGO_PATH);
                        x.CALENDAR_PHOTO_PATH = GetFilepath(x.CALENDAR_PHOTO_PATH);
                    });
                    return result;

                }
                else
                {
                    return new List<FavouriteCalendar>();
                }
            }
            catch (Exception ex)
            {
                return new List<FavouriteCalendar>();
            }
        }



        public async Task<List<MyWalletCalander>> GetMyWalletCalendars(MyWalletClanderApiModel data, string userName)
        {


            try
            {
                string CompanyCode = data.COMPANY_CODE;
                string CompanyLogic = "";

                if (!string.IsNullOrEmpty(CompanyCode))
                {
                    CompanyLogic = " and calendarDetails.COMPANY_CODE = '" + CompanyCode + "'";
                }

                int PageSize = data.size > 0 ? data.size : 20;
                int PageNumber = data.page > 0 ? data.page : 1;


                string query = $@"declare @UserId varchar(max) = '{userName}'
                                  declare @currentDate varchar(100) = '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                  declare @Ids varchar(max) = stuff((select distinct ',' + phm.CALENDAR_CODE

								  from PAYMENT_HISTORY_MASTER_1956 phm
								  join ORDER_MASTER_1969 ord on ord.ORDER_NO = phm.PAYMENT_ID
								  where phm.USER_ID = @UserId and cast(@currentDate as datetime) <= cast(phm.CREDIT_EXPIRE_DATE as datetime) and phm.STATUS = 'complete'
								  and ord.ORDER_TYPE = 'PACKAGE'
								  for xml path('')), 1, 1, '')
			  
                                  declare @PageSize int=10 ,  @PageNumber int=1 ; with formdata as (
                                              select
									  (select 
											case when (
												(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = @UserId and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)) - SUM(led.DEBIT_COIN) - SUM(led.DEBIT_COIN)
											) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = @UserId and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)) - SUM(led.DEBIT_COIN) - SUM(led.DEBIT_COIN) <= 0
											then
												0
											else
												(select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = @UserId and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)) - SUM(led.DEBIT_COIN)
											end
										FROM LEDGER_MASTER_1957 led 
										join ORDER_MASTER_1969 ord on ord.ORDER_NO = led.ORDER_NO
										where led.USER_ID = @UserId and led.CALENDAR_CODE = calendarDetails.CALENDAR_CODE ) as 'COIN_BALANCE'
									  
									  
									  ,(select CREDIT_EXPIRE_DATE,
										(
										select case when (sum(CREDIT_COIN) - sum(DEBIT_COIN) <= 0) then 0 else cast(sum(CREDIT_COIN) - sum(DEBIT_COIN) as varchar) end from LEDGER_MASTER_1957 where ORDER_NO = pay.PAYMENT_ID
										) as 'Balance'
										from PAYMENT_HISTORY_MASTER_1956 pay
										join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID
										where ord.ORDER_TYPE = 'PACKAGE' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and pay.USER_ID = @UserId and pay.STATUS = 'complete' and cast(@currentDate as datetime) < cast(substring(CREDIT_EXPIRE_DATE, 1, 16) as datetime)
									   for json auto) as 'PackageInfo'
									  ,company.Id as 'CompanyId'
                                      ,calendarDetails.*
	                                  ,company.COMPANY_NAME_ENGLISH
                                      ,company.COMPANY_LOGO_PATH
                                      ,subCategory.CALENDAR_SUB_CATEGORY_NAME
									  ,stuff( (select distinct ',' + ACTIVITY_NAME from SERVICE_MASTER_1933 service_m where service_m.CALENDAR_CODE = calendarDetails.CALENDAR_CODE for xml path('')), 1, 1, '') as 'ServiceList'
									  FROM BUSINESS_CALENDAR_MASTER_1925 calendarDetails
                                  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendarDetails.COMPANY_CODE

								  join CALENDAR_SUB_CATEGORY_MASTER_1930 subCategory ON ',' + calendarDetails.CALENDAR_SUB_CATEGORY_ID + ',' LIKE '%,' + CAST(subCategory.Id AS NVARCHAR(MAX)) + ',%'
                                  where calendarDetails.CALENDAR_CODE in (select cast(item as varchar(max)) from dbo.SplitString(@Ids, ',')) {CompanyLogic}

								  )
                                  Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata  ORDER BY created_at desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";


                var result = (await sqlFunction.ExecuteSqlQuery<MyWalletCalander>(query)).ToList();
                if (result.Any())
                {
                    result.ForEach(x =>
                    {
                        if (x.PackageInfo != null && x.PackageInfo is string PackageInfoString)
                        {


                            x.PackageInfo = JsonConvert.DeserializeObject<dynamic>(x.PackageInfo.ToString());

                        }
                        else
                        {
                            x.PackageInfo = "";
                        }


                        x.COMPANY_LOGO_PATH = GetFilepath(x.COMPANY_LOGO_PATH);
                        x.CALENDAR_PHOTO_PATH = GetFilepath(x.CALENDAR_PHOTO_PATH);
                    });




                    return result;

                }
                else
                {
                    return new List<MyWalletCalander>();
                }

            }
            catch (Exception ex)
            {
                return new List<MyWalletCalander>();
            }
        }

        public async Task<List<MyWalletCompany>> GetMyWalletCompanyList(string userName)
        {
            try
            {

                string query = $@"declare @UserId varchar(max) = '{userName}'
                                        declare @currentDate varchar(100) = '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                        declare @Ids varchar(max) = stuff((select distinct ',' + phm.COMPANY_CODE
                                        from PAYMENT_HISTORY_MASTER_1956 phm
                                        join ORDER_MASTER_1969 ord on ord.ORDER_NO = phm.PAYMENT_ID
                                        where phm.USER_ID = @UserId and cast(@currentDate as datetime) <= cast(phm.CREDIT_EXPIRE_DATE as datetime) 
                                        and phm.STATUS = 'complete' and ord.ORDER_TYPE = 'PACKAGE'
                                        for xml path('')), 1, 1, '')
                                select Id,COMPANY_CODE,COMPANY_NAME_ENGLISH as COMPANY_NAME from BUSINESS_COMPANY_MASTER_1924 where COMPANY_CODE in (select cast(item as varchar) from dbo.SplitString(@Ids, ',')) ";

                var result = (await sqlFunction.ExecuteSqlQuery<MyWalletCompany>(query)).ToList();
                if (result.Any())
                {
                    return result;
                }
                else
                {
                    return new List<MyWalletCompany>();
                }

            }
            catch (Exception ex)
            {
                return new List<MyWalletCompany>();
            }
        }


        public async Task<List<MyFavouriteCompany>> GetPaymentCompanyList(string userName)
        {
            try
            {

                string query = $@"SELECT BC.Id,Ph.COMPANY_CODE, BC.COMPANY_NAME_ENGLISH as COMPANY_NAME
                                    FROM payment_history_master_1956 Ph
                                    INNER JOIN BUSINESS_COMPANY_MASTER_1924 BC ON BC.COMPANY_CODE = PH.COMPANY_CODE
                                    WHERE USER_ID = '{userName}' 
                                    GROUP BY Ph.COMPANY_CODE, BC.COMPANY_NAME_ENGLISH ,BC.Id";

                var result = (await sqlFunction.ExecuteSqlQuery<MyFavouriteCompany>(query)).ToList();
                if (result.Any())
                {
                    return result;
                }
                else
                {
                    return new List<MyFavouriteCompany>();
                }

            }
            catch (Exception ex)
            {
                return new List<MyFavouriteCompany>();
            }
        }

        public async Task<List<object>> GetPaymentYearList(string userName)
        {
            try
            {

                string query = $@"SELECT  DISTINCT YEAR(Ph.PAID_DATE) AS PAYMENTYEAR
                                FROM payment_history_master_1956  Ph
                                WHERE USER_ID='{userName}' ";

                var result = (await sqlFunction.ExecuteSqlQuery<object>(query)).ToList();
                if (result.Any())
                {
                    return result;
                }
                else
                {
                    return new List<object>();
                }

            }
            catch (Exception ex)
            {
                return new List<object>();
            }
        }



        public async Task<List<PaymentHistoryApiModel>> PaymentHistory(PaymentHistorySearchApiModel data, string userName)
        {
            try
            {
                string searchFilter = "";
                int PageSize = data.size > 0 ? data.size : 20;
                int PageNumber = data.page > 0 ? data.page : 1;

                if (data.COMPANY_CODE !="")
                {
                    searchFilter += " and f.COMPANY_CODE ='" + data.COMPANY_CODE + "'";
                }

                if (data.Year != "")
                {
                    searchFilter += " and YEAR(f.PAID_DATE) ='" + data.Year + "'";
                }


                string query = $@"DECLARE @PageSize INT={PageSize} ,
                                @PageNumber INT= {PageNumber} ;WITH formdata AS
                            (
                                            SELECT DISTINCT a_0.[PACKAGE_NAME] [PLAN_ID] ,
                                                            a_0.[Id] [PLAN_ID_Id] ,
                                                            f.id,                                
                                                            f.formrecordorder,
                                                            f.created_at,
                                                            f.updated_at ,
                                                            f.[PAYMENT_ID],
                                                            f.[COMPANY_CODE],BC.COMPANY_NAME_ENGLISH as  COMPANY_NAME,Bcl.CALENDAR_NAME,
                                                            f.[CALENDAR_CODE],
                                                            f.[B_COIN_PURCHASE],
                                                            f.[PAID_DATE],
                                                            f.[METHOD],
                                                            f.[CLIENT_PAID_HKD],
                                                            f.[STATUS],
                                                            f.[USER_ID],
                                                            f.[CREDIT_EXPIRE_DATE]
                                            FROM            payment_history_master_1956 f
                                            LEFT JOIN       calendar_package_master_1952 a_0
                                            ON              f.[PLAN_ID] = a_0.[Id]
                                            inner join      BUSINESS_COMPANY_MASTER_1924 BC on BC.COMPANY_CODE=f.COMPANY_CODE
	                                        inner join      BUSINESS_CALENDAR_MASTER_1925   Bcl on Bcl.CALENDAR_CODE=f.CALENDAR_CODE
                                            WHERE           f.id!=0  and USER_ID='{userName}' {searchFilter}   )
                            SELECT   Count(*) OVER() total_records,@PageSize  size,@PageNumber     AS 'page',* FROM     formdata ORDER BY [formRecordOrder] ASC offset @PageSize * (@PageNumber - 1) rows FETCH next @PageSize rows only OPTION(recompile);";


                var result = (await sqlFunction.ExecuteSqlQuery<PaymentHistoryApiModel>(query)).ToList();
                if (result.Any())
                {

                    return result;
                }
                else
                {
                    return new List<PaymentHistoryApiModel>();
                }

            }
            catch (Exception ex)
            {
                return new List<PaymentHistoryApiModel>();
            }
        }



        private string GetDateQuery(DateTime start, DateTime end)
        {
            string _start = start.ToString("yyyy-MM-dd");
            string _end = end.ToString("yyyy-MM-dd");
            return $@"((cast([start] as date) <= '{_start}' and (cast([end] as date) <= '{_end}' and cast([end] as date) >= '{_start}')) or
										((cast([start] as date) >= '{_start}' and cast([start] as date) <= '{_end}') and (cast([end] as date) <= '{_end}' and cast([end] as date) >= '{_start}')) or
										((cast([start] as date) <= '{_end}' and cast([start] as date) >= '{_start}') and cast([end] as date) >= '{_end}') or
										(cast([start] as date) <= '{_start}' and cast([end] as date) >= '{_end}'))";
        }
        #endregion


    }
}
