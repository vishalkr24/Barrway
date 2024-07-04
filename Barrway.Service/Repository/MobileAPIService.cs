
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
using Barrway.DTO.APIModels.Account;
using Barrway.DTO.APIModels.Payment;
using Barrway.DTO.PublicModels;

namespace Barrway.Service.Repository
{
    public class MobileAPIService : IMobileAPIService
    {
        private readonly ISqlFunction sqlFunction;
        private readonly IFormAPIRepository formAPIRepository;
        private readonly IMapper mapper;
        private readonly IAuthService authService;
        private readonly ICommonService commonService;
        private readonly string baseUrl = ConfigurationManager.AppSettings["baseurl"];

        public MobileAPIService(ISqlFunction sqlFunction, IFormAPIRepository formAPIRepository, IMapper mapper, IAuthService authService, ICommonService commonService)
        {
            this.sqlFunction = sqlFunction;
            this.formAPIRepository = formAPIRepository;
            this.mapper = mapper;
            this.authService = authService;
            this.commonService = commonService;
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

        public async Task<UserProfile> GetUserProfileDetails(string UserId)
        {
            string query = $@"SELECT publicUser.[Id]
                              ,publicUser.[USER_ID]
                              ,publicUser.[USER_EMAIL]                             
                              ,publicUser.[Country_Code]
                              ,publicUser.[USER_PHONE]
                              ,publicUser.[IS_EXTERNAL_SIGNUP]
                              ,publicUser.[IS_EMAIL_VERIFIED]
                              ,publicUser.[IS_PHONE_VERIFIED]
                              ,publicUser.[created_at]
                              ,publicUser.[updated_at]
                              ,publicUser.[created_by]
                              ,publicUser.[updated_by]
                              ,publicUser.[IS_ACTIVE]
                              ,publicUser.[PROFILE_STATUS]
                              ,publicUser.[ROLE_ID]
                              ,publicUser.[SIGNUP_TYPE], publicUser.[Id]      ,publicUser.[created_at]      ,publicUser.[updated_at]      ,publicUser.[created_by]      ,publicUser.[updated_by]      ,publicUser.[USER_ID]      ,[SUBSCRIPTION_PLAN_ID]      ,publicUser.[CURRENT_STEP]     ,[FIRST_NAME]      ,[LAST_NAME]      ,[PROFILE_PHOTO_PATH]      ,[PROFILE_PHOTO_NAME]      ,[CHINESE_NAME]      ,[NICK_NAME]      ,[GENDER]      ,[DATE_OF_BIRTH]  
                        FROM[dbo].[PUBLIC_USER_ACCOUNT_1943] account 
                        join USER_MASTER_1915 publicUser on publicUser.USER_ID = account.USER_ID
                        where publicUser.USER_ID = N'" + UserId + "'";

            var _UserProfile = (await sqlFunction.ExecuteSqlQuery<UserProfile>(query)).FirstOrDefault();


            if (_UserProfile != null)
            {

                _UserProfile.PROFILE_PHOTO_PATH = GetFilepath(_UserProfile.PROFILE_PHOTO_PATH);
                return _UserProfile;
            }
            else
            {
                return null;
            }
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

        public async Task<AddUpdateDelete> GetCalendarsByCompanyCode(string CompanyCode)
        {
            string query = $@"SELECT calendar.[Id], calendar.CALENDAR_FUNCTION_TYPE, calendar.STATUS, calendar.[created_at], company.IS_ACTIVE      ,calendar.[updated_at]      ,calendar.[created_by]      ,calendar.[updated_by]      ,[CALENDAR_NAME]     ,calendar.[CALENDAR_CODE]      ,[CALENDAR_PHOTO_NAME]      ,[CALENDAR_PHOTO_PATH]      ,[IS_VISIBLE]      ,calendar.[COUNTRY_ID]      ,calendar.[CITY_ID]      ,calendar.[DISTRICT_ID]      ,[CALENDAR_CATEGORY_ID]      ,[CALENDAR_SUB_CATEGORY_ID]      ,calendar.[COMPANY_CODE]  FROM [dbo].[BUSINESS_CALENDAR_MASTER_1925] calendar
                                join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE 
                                join CALENDAR_COMMON_CATEGORY_1978 category on category.Id = calendar.CALENDAR_COMMON_CATEGORY_ID
                                where company.IS_ACTIVE = 'Y' and company.COMPANY_CODE = '{CompanyCode}' and calendar.CALENDAR_USE_TYPE = 'PUBLIC' and calendar.STATUS = 'PUBLISH'";

            var result = await sqlFunction.ExecuteSqlQuery<CalendarModel>(query);

            if (result.Count() > 0)
            {
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }

        public async Task<List<CalendarModel>> GetCalendarsSearchResult(SearchAPIModel data, List<string> filters = null)
        {

            data.page = data.page == 0 ? 1 : data.page;
            data.size = data.size == 0 ? 10 : data.size;

            List<string> filterQueryList = filters == null ? new List<string>() : filters;

            if (data.categoryId > 0)
            {
                filterQueryList.Add(" category.Id=" + data.categoryId);
            }

            if (data.districtIds != null && data.districtIds.Count() > 0)
            {
                string commaSeparatedIds = string.Join(",", data.districtIds);
                filterQueryList.Add(" calendar.DISTRICT_ID in (" + commaSeparatedIds + ")");
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
                filterQueryList.Add(" calendar.[CALENDAR_NAME] like N'%" + data.keyword + "%' ");
            }

            if (!string.IsNullOrEmpty(data.company_code))
            {
                filterQueryList.Add($" (company.COMPANY_CODE='{data.company_code}')");
            }

            string filterQuery = "";
            if (filterQueryList.Count() > 0)
            {

                filterQuery = " AND (" + string.Join(" and ", filterQueryList) + ")";
                //filterQuery = " AND (" + string.Join(" OR ", filterQueryList) + ")";
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
                                  (select Id,COMPANY_NAME_ENGLISH +'|'+COMPANY_NAME_CHINESE AS COMPANY_NAME,COMPANY_CODE,COMPANY_NAME_ENGLISH,COMPANY_BANNER_PATH,COMPANY_LOGO_PATH,COMPANY_BANNER_NAME,TAGS,isnull(IS_FEATURED,'N') as IS_FEATURED  from BUSINESS_COMPANY_MASTER_1924  {filterQuery}
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
                                  (select blog.Id, blog.created_at, blog.BLOG_TITLE,blog.[IMAGE],blog.YOUTUBE_LINK,blog.TAG,blog_c.BLOG_CATEGORY,blog.BLOG_CATEGORY BLOG_CATEGORY_ID ,isnull(blog.IS_FEATURED,'NO')as IS_FEATURED,isnull(blog.IS_HOT,'No') as IS_HOT  from BLOG_1980 blog
                                  join BLOG_CATEGORY_1981 blog_c on blog.BLOG_CATEGORY=blog_c.Id  {filterQuery}
                                  ) Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata ORDER BY Id OFFSET @PageSize * (@PageNumber - 1) ROWS 
                                  FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";
            var blogs = (await sqlFunction.ExecuteSqlQuery<BlogModel>(sqlString)).ToList();
            blogs.ForEach(x => x.TAG = formatTagsString(x.TAG));
            return blogs;
        }


        public async Task<AddUpdateDelete<BlogDetailModel>> GetBlogdetail(int BlogId)
        {
            try
            {
                string sqlString = $@"select blog.Id, blog.created_at, blog.BLOG_TITLE,blog.BLOG_CONTENT,blog.[IMAGE],blog.YOUTUBE_LINK,blog.TAG,blog_c.BLOG_CATEGORY,blog.BLOG_CATEGORY,blog.IS_FEATURED,blog.IS_HOT 
                                  BLOG_CATEGORY_ID from BLOG_1980 blog join BLOG_CATEGORY_1981 blog_c on blog.BLOG_CATEGORY=blog_c.Id where blog.Id ='{BlogId}';";
                var blogs = (await sqlFunction.ExecuteSqlQuery<BlogDetailModel>(sqlString)).FirstOrDefault();
                if (blogs != null)
                {
                    blogs.TAG = formatTagsString(blogs.TAG);
                    return new AddUpdateDelete<BlogDetailModel>() { Status = true, Message = "success", Data = blogs };
                }
                else
                {
                    return new AddUpdateDelete<BlogDetailModel>() { Status = false, Message = "No data found !" };
                }

            }
            catch (Exception ex)
            {
                return new AddUpdateDelete<BlogDetailModel>() { Status = false, Message = "Error" };
            }
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
									left join SESSION_REVIEWS_1983 review on review.EVENT_ID = transaction_m.SLOT and review.USER_ID = participant_m.STUDENT_ID
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


        public async Task<AddUpdateDelete> EnrollPublicUserForCalendar(CalendarEnrollModel model, bool isServiceType = false, string PaymentId = null)
        {
            var user = await authService.GetUser(model.USER_ID, FormRole.GENERAL_USER);


            // check for sufficient B$ Balance
            var balance = await GetUserCoinBalance(model.USER_ID, model.participant.COMPANY_CODE, model.participant.CALENDAR_CODE);
            var service = await sqlFunction.ExecuteSqlQuery("select fees_1, IS_SERVICE_PAID from SERVICE_MASTER_1933 where Id = " + model.transaction.ACTIVITY);

            bool IsServicePaid = false;
            int ServiceFees = 0;

            if (!string.IsNullOrEmpty(service[0]["IS_SERVICE_PAID"]?.ToString()))
            {
                if (service[0]["IS_SERVICE_PAID"]?.ToString() == "Y")
                {
                    if (!string.IsNullOrEmpty(service[0]["fees_1"]?.ToString()))
                    {
                        if (Convert.ToInt32(service[0]["fees_1"]) > 0)
                        {
                            IsServicePaid = true;
                            ServiceFees = Convert.ToInt32(service[0]["fees_1"]);
                        }
                        else
                        {
                            IsServicePaid = false;
                            ServiceFees = 0;
                        }
                    }
                    else
                    {
                        IsServicePaid = false;
                        ServiceFees = 0;
                    }
                }
                else
                {
                    IsServicePaid = false;
                    ServiceFees = 0;
                }

            }
            else
            {
                IsServicePaid = false;
                ServiceFees = 0;
            }

            if (IsServicePaid && string.IsNullOrEmpty(PaymentId))
            {
                if (balance.Data > 0)
                {
                    if (Convert.ToInt32(balance.Data) < Convert.ToInt32(service[0]["fees_1"]))
                    {
                        return new AddUpdateDelete() { Status = false, Message = "You don't have enough credits of this calendar to book this slot." };
                    }
                    else
                    {
                        model.transaction.transaction_fees = ServiceFees.ToString();
                    }
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "You don't have enough credits of this calendar to book this slot." };
                }
            }
            else
            {
                model.transaction.transaction_fees = ServiceFees.ToString();
            }

            // check for booking deadline

            var calendarDetails = (await GetCalendarDetails(model.participant.CALENDAR_CODE)).Data as IDictionary<string, object>;

            if (!string.IsNullOrEmpty(calendarDetails["BOOKING_DEADLINE"]?.ToString()))
            {
                int days = 0;

                try
                {
                    days = Convert.ToInt32(calendarDetails["BOOKING_DEADLINE"].ToString());
                }
                catch (Exception ex)
                {

                }

                days += 1;

                //var evt = (await GetSingleEventDetails(model.transaction.SLOT)).Data as IDictionary<string, object>;
                var evt = (await GetSingleEventDetails(model.transaction.SLOT)) as IDictionary<string, object>;

                DateTime deadline = Convert.ToDateTime(evt["start"].ToString()).AddDays((days * -1));
                DateTime deadlineDate = new DateTime(deadline.Year, deadline.Month, deadline.Day, 23, 59, 0);

                if (DateTimeUtility.Now() > deadlineDate)
                {
                    return new AddUpdateDelete() { Message = "DEADLINE-CROSSED", Status = false };
                }

            }


            // check if the user limit is crossed or not
            if (!isServiceType)
            {
                List<IDictionary<string, object>> totalUsersEnrolled = await sqlFunction.ExecuteSqlQuery($@"select COUNT(*) as 'COUNT' from TRANSACTION_MASTER_1942 transaction_m
                                                                                                        join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
                                                                                                        where ACTIVITY = '{model.transaction.ACTIVITY.ToString()}'");

                List<IDictionary<string, object>> currentLimit = await sqlFunction.ExecuteSqlQuery($@"select MAXIMUM_NO_OF_PARTICIPANTS from SERVICE_MASTER_1933 where Id = '{model.transaction.ACTIVITY.ToString()}'");

                try
                {
                    if (!string.IsNullOrEmpty(currentLimit[0]["MAXIMUM_NO_OF_PARTICIPANTS"].ToString()))
                    {
                        if (Convert.ToInt32(currentLimit[0]["MAXIMUM_NO_OF_PARTICIPANTS"].ToString()) > 0)
                        {
                            if (Convert.ToInt32(totalUsersEnrolled[0]["COUNT"].ToString()) >= Convert.ToInt32(currentLimit[0]["MAXIMUM_NO_OF_PARTICIPANTS"].ToString()))
                            {
                                return new AddUpdateDelete() { Message = "LIMIT-ERROR", Status = false };
                            }
                        }
                    }

                }
                catch (Exception ex)
                {

                }
            }

            // Check if the user already exist in the participant master

            List<IDictionary<string, object>> participantCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from PARTICIPANT_MASTER_1940 where STUDENT_ID = N'{model.USER_ID}' and COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE}'");

            string StudentId = "";
            if (participantCheckResult.Count > 0)
            {
                // Participant already exist so no need to check if it is enrolled with the selected activity and resource
                StudentId = participantCheckResult.FirstOrDefault()["Id"].ToString();
                List<IDictionary<string, object>> transactionCheckResult = await sqlFunction.ExecuteSqlQuery($@"select * from TRANSACTION_MASTER_1942 where COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE}' and RESOURCE = '{model.transaction.RESOURCE}' and ACTIVITY = '{model.transaction.ACTIVITY}' and SLOT='{model.transaction.SLOT}' and student='{StudentId}'");

                if (transactionCheckResult.Count > 0)
                {
                    // user is already enrolled in the activity and resource
                    return new AddUpdateDelete() { Message = "ALREADY-ENROLLED", Status = false };
                }

            }
            else
            {
                var bookingsCheckData = await GetBookingsForThisMonth(model.participant.COMPANY_CODE, model.transaction.SLOT);
                if (bookingsCheckData.Status)
                {
                    if (Convert.ToInt32(bookingsCheckData.Data["AVAILABLE_BOOKINGS"]?.ToString()) == 0)
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Unable to book this event" };
                    }
                }
                else
                {
                    return bookingsCheckData;
                }

                // add entry in participant master table
                var publicUser = await GetSinglePublicUserAccount(model.USER_ID);

                model.participant.STUDENT_ID = model.USER_ID;

                model.participant.NICKNAME = publicUser.Data["NICK_NAME"].ToString();
                model.participant.EMAIL = user.Data["USER_EMAIL"].ToString();

                model.participant.ADDRESS = "";
                model.participant.GENDER = publicUser.Data["GENDER"].ToString();
                model.participant.IS_ACTIVE = "Y";
                string fullName = publicUser.Data["FIRST_NAME"].ToString() + " " + publicUser.Data["LAST_NAME"].ToString();
                if (string.IsNullOrEmpty(fullName.Trim()))
                {
                    fullName = model.participant.EMAIL;
                }
                model.participant.STUDENT_NAME = fullName;

                Form_DataTable data = new Form_DataTable();
                data.action = (int)FormAction.Save;
                data.formId = (int)FormSetting.PARTICIPANT_MASTER;
                data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.participant.ToDictionary());
                data.formGroupKey = Guid.NewGuid().ToString();
                var formResult = (await formAPIRepository.GeneratedFormData(data)).Data;

                if (formResult.res == 1)
                {
                    StudentId = formResult.Id.ToString();

                    string ParticipantCode = "PC" + formResult.Id.ToString().PadLeft(5, '0');

                    string query = $@"UPDATE [dbo].[PARTICIPANT_MASTER_1940]
                                   SET [PARTICIPANT_CODE] = '{ParticipantCode}'
                                 WHERE Id = '{formResult.Id.ToString()}'";

                    int saveResult = await sqlFunction.ExecuteSqlCommandQuery(query);
                }
                else
                {
                    return new AddUpdateDelete() { Message = "Failed to add participant", Status = false };
                }

            }

            // send Entry into transaction master
            model.transaction.STUDENT = StudentId;
            Form_DataTable data2 = new Form_DataTable();
            data2.action = (int)FormAction.Save;
            data2.formId = (int)FormSetting.TRANSACTION_MASTER;

            data2.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.transaction.ToDictionary());
            data2.formGroupKey = model.FormGroupKey;
            var formResult2 = (await formAPIRepository.GeneratedFormData(data2)).Data;

            // Send Entry into Upcoming Bookings

            string upcomingBookingQuery = $@"INSERT INTO [dbo].[COMPANY_UPCOMING_BOOKINGS_1945]
                                                   ([formGroupKey]
                                                   ,[formID]
                                                   ,[userID]
                                                   ,[Current_Status]
                                                   ,[cycle]
                                                   ,[MasterFormID]
                                                   ,[MasterFormRow]
                                                   ,[formRecordOrder]
                                                   ,[formRecordStatus]
                                                   ,[ApprovalStatus]
                                                   ,[created_at]
                                                   ,[updated_at]
                                                   ,[created_by]
                                                   ,[updated_by]
                                                   ,[COMPANY_CODE]
                                                   ,[CALENDAR_CODE]
                                                   ,[BOOKING_DATE]
                                                   ,[SERVICE_NAME]
                                                   ,[SERVICE_PROVIDER]
                                                   ,[CLIENT_NAME]
                                                   ,[FROM_TIME]
                                                   ,[TO_TIME],[EVENT_ID],[USER_ID])
                                             VALUES
                                                   ('{Guid.NewGuid().ToString()}'
                                                   ,2315
                                                   ,30314
                                                   ,0
                                                   ,0
                                                   ,0
                                                   ,0
                                                   ,0
                                                   ,(select ISNULL(Max(formRecordOrder), 0) from COMPANY_UPCOMING_BOOKINGS_1945)
                                                   ,0
                                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                   ,'{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}'
                                                   ,null
                                                   ,null
                                                   ,'{model.transaction.COMPANY_CODE}'
                                                   ,'{model.transaction.CALENDAR_CODE}'
                                                   ,(select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = '{model.transaction.SLOT}')                                                                                                                                                                                                     
                                                   ,N'{SQLUtility.TreatSingleQuoteForQuery(model.ACTIVITY_NAME)}'
                                                   ,N'{SQLUtility.TreatSingleQuoteForQuery(model.RESOURCE_NAME)}'
                                                   ,N'{SQLUtility.TreatSingleQuoteForQuery(model.transaction.STUDENT)}'
                                                   ,(select CALENDAR_FORM_1935.[start] from  CALENDAR_FORM_1935 where Id = N'{model.transaction.SLOT}') 
                                                   ,(select calendar.[end] from  CALENDAR_FORM_1935 calendar where Id = N'{model.transaction.SLOT}')
                                                   , '{model.transaction.SLOT}', '{model.USER_ID}')";


            var upcomingResult = await sqlFunction.ExecuteSqlCommandQuery(upcomingBookingQuery);

            if (Convert.ToInt32(model.transaction.transaction_fees) > 0)
            {
                string paymentId = PaymentId;

                if (string.IsNullOrEmpty(paymentId))
                {
                    string orderNoQuery = $@"select *,
                                                    (
                                                    select case when (sum(CREDIT_COIN) - sum(DEBIT_COIN) <= 0) then 0 else sum(CREDIT_COIN) - sum(DEBIT_COIN) end from LEDGER_MASTER_1957 where ORDER_NO = PAYMENT_ID
                                                    ) as 'Balance'
                                                    from PAYMENT_HISTORY_MASTER_1956 where COMPANY_CODE = '{model.participant.COMPANY_CODE}' and CALENDAR_CODE = '{model.participant.CALENDAR_CODE.ToString()}' and STATUS = 'complete' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and USER_ID = N'{model.USER_ID}'
                                                    order by cast(created_at as datetime)";

                    var orderNoResult = await sqlFunction.ExecuteSqlQuery(orderNoQuery);

                    paymentId = orderNoResult.FirstOrDefault(x => Convert.ToInt32(x["Balance"]) > 0)["PAYMENT_ID"]?.ToString();
                }

                // add entry in ledger
                try
                {
                    LedgerModel ledger = new LedgerModel()
                    {
                        CALENDAR_CODE = model.transaction.CALENDAR_CODE,
                        COMPANY_CODE = model.transaction.COMPANY_CODE,
                        DEBIT_COIN = Convert.ToDouble(model.transaction.transaction_fees),
                        USER_ID = model.USER_ID,
                        CREDIT_COIN = 0,
                        ORDER_NO = (model.transaction.transaction_fees == "0") ? "" : paymentId,
                        TRANSACTION_TYPE = "Booking"
                    };
                    var ledgerResult = await CreateLedgerEntry(ledger);

                }
                catch (Exception ex)
                {
                    return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
                }
            }

            try
            {

                if (formResult2.res == 1)
                {
                    return new AddUpdateDelete() { Message = "Success", Status = true, Data = formResult2.Id };
                }
                else
                {
                    return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Message = "Failed to enroll on calendar", Status = false };
            }

        }



        public async Task<AddUpdateDelete> CancelBooking(string SLOT, string USER_ID)
        {
            string query = $@"select ser.CANCELLATION_BEFORE, cf.[start], cf.[end], ser.[SERVICE_PAY_PER], t.* from CALENDAR_FORM_1935 cf
                                join TRANSACTION_MASTER_1942 t on t.SLOT = cf.Id
                                join PARTICIPANT_MASTER_1940 p on p.Id = t.STUDENT
								join SERVICE_MASTER_1933 ser on ser.Id = t.ACTIVITY
                                where cf.Id = '{SLOT}' and p.STUDENT_ID = N'{USER_ID}'";
            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                int cancellationMinutes = 0;

                if (!string.IsNullOrEmpty(result[0]["CANCELLATION_BEFORE"]?.ToString()))
                {
                    try
                    {
                        cancellationMinutes = Convert.ToInt32(result[0]["CANCELLATION_BEFORE"].ToString());
                    }
                    catch (Exception ex)
                    {

                    }
                }

                if (DateTimeUtility.Now() < Convert.ToDateTime(result[0]["start"]?.ToString()).AddMinutes(-(cancellationMinutes)))
                {
                    if (result[0]["SERVICE_PAY_PER"]?.ToString() == "COURSE")
                    {
                        query = $@"update TRANSACTION_MASTER_1942 set ATTENDANCE = 'ABSENT' where Id = '{result[0]["Id"]?.ToString()}'";
                    }
                    else
                    {
                        query = $@"delete from COMPANY_UPCOMING_BOOKINGS_1945 where USER_ID = N'{USER_ID}' and EVENT_ID = (select top 1 SLOT from TRANSACTION_MASTER_1942 where Id = '{result[0]["Id"]?.ToString()}'); delete from TRANSACTION_MASTER_1942 where Id = '{result[0]["Id"]?.ToString()}';";
                    }

                    var result2 = await sqlFunction.ExecuteSqlCommandQuery(query);

                    if (result2 > 0)
                    {
                        return new AddUpdateDelete() { Status = true, Message = "Booking cancelled successfully!" };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = false, Message = "Booking not cancelled!" };
                    }

                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Can't cancel your booking now!" };
                }
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "Booking not found" };
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


        public async Task<AddUpdateDelete> GetSinglePublicUserAccount(string UserId)
        {
            string query = $@"SELECT publicUser.[Id]
                              ,publicUser.[USER_ID]
                              ,publicUser.[USER_EMAIL]
                              ,publicUser.[USER_PASSWORD]
                              ,publicUser.[Country_Code]
                              ,publicUser.[USER_PHONE]
                              ,publicUser.[IS_EXTERNAL_SIGNUP]
                              ,publicUser.[IS_EMAIL_VERIFIED]
                              ,publicUser.[IS_PHONE_VERIFIED]
                              ,publicUser.[created_at]
                              ,publicUser.[updated_at]
                              ,publicUser.[created_by]
                              ,publicUser.[updated_by]
                              ,publicUser.[IS_ACTIVE]
                              ,publicUser.[PROFILE_STATUS]
                              ,publicUser.[ROLE_ID]
                              ,publicUser.[SIGNUP_TYPE], publicUser.[Id]      ,publicUser.[created_at]      ,publicUser.[updated_at]      ,publicUser.[created_by]      ,publicUser.[updated_by]      ,publicUser.[USER_ID]      ,[SUBSCRIPTION_PLAN_ID]      ,publicUser.[CURRENT_STEP]     ,[FIRST_NAME]      ,[LAST_NAME]      ,[PROFILE_PHOTO_PATH]      ,[PROFILE_PHOTO_NAME]      ,[CHINESE_NAME]      ,[NICK_NAME]      ,[GENDER]      ,[DATE_OF_BIRTH]  
                        FROM[dbo].[PUBLIC_USER_ACCOUNT_1943] account 
                        join USER_MASTER_1915 publicUser on publicUser.USER_ID = account.USER_ID
                        where publicUser.USER_ID = N'" + UserId + "'";

            List<IDictionary<string, object>> businessWebsiteResult = await sqlFunction.ExecuteSqlQuery(query);

            if (businessWebsiteResult.Count > 0)
            {
                var businessWebsite = businessWebsiteResult.FirstOrDefault();
                businessWebsite["USER_PASSWORD"] = Aes256CbcEncrypter.Decrypt(businessWebsite["USER_PASSWORD"]?.ToString());
                return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = businessWebsite };
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
        }


        public async Task<AddUpdateDelete> GetBookingsForThisMonth(string CompanyCode, string SlotId)
        {
            string query = $@"declare @CompanyCode varchar(100) = '{CompanyCode}';
                                declare @SubscriptionDate varchar(200);
                                declare @SubscriptionEndDate varchar(200);
                                set @SubscriptionDate = (select top 1 f.created_at from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)
                                set @SubscriptionEndDate = (select top 1 bom.VALID_TILL from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID join BUSINESS_ORDER_MASTER_1970 bom on bom.ORDER_NO = f.ORDER_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)

                                if(@SubscriptionDate is not null and @SubscriptionEndDate is not null)
                                begin
	                                declare @StartDate datetime;
	                                declare @EndDate datetime;
	                                declare @Validity varchar(2) = 'N';

	                                set @StartDate = cast(@SubscriptionDate as datetime);
	                                set @EndDate = cast(DATEADD(MONTH, 1, @StartDate) as datetime);
	
	                                while (cast(@EndDate as datetime) <= cast(@SubscriptionEndDate as datetime)) 
	                                begin
		                                if(@StartDate <= cast(getDate() as datetime) and cast(getDate() as datetime) <= @EndDate)
		                                begin
			                                set @Validity = 'Y'
			                                break;
		                                end
		                                else
		                                begin
			                                set @StartDate = @EndDate
			                                set @EndDate = cast(DATEADD(MONTH, 1, @EndDate) as datetime)
		                                end
		
	                                end
	
	                                if(@Validity = 'Y')
		                               with cte as (
		                                    select count(*) as 'MONTHLY_BOOKINGS',
		                                    ((select top 1 f.ASSIGNED_BOOKINGS from COMPANY_SUBSCRIPTION_DETAILS_1939 f join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID where company.COMPANY_CODE = @CompanyCode and f.IS_ACTIVE = 'Y' order by f.created_at desc)) as 'ASSIGNED_BOOKINGS'
		                                    from TRANSACTION_MASTER_1942 f
		                                    join CALENDAR_FORM_1935 clf on clf.Id = f.SLOT
		                                    where f.SLOT = '{SlotId}' and f.COMPANY_CODE = @CompanyCode and f.created_at >= @StartDate and f.created_at <= @EndDate
		                                    )
		                                    select *, (ASSIGNED_BOOKINGS - MONTHLY_BOOKINGS) as 'AVAILABLE_BOOKINGS' from cte
	                                else 
		                                select null as 'result'
                                end
                                else
	                                select null as 'result'";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                if (result.Any(x => x.ContainsKey("result")))
                {
                    return new AddUpdateDelete() { Status = false, Message = "Unable to book this event" };
                }
                else
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };
                }
            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "Unable to book this event" };
            }

        }


        public async Task<AddUpdateDelete> GetCalendarDetails(string calendarCode, string UserId = null)
        {
            try
            {
                string sqlString = "";

                if (string.IsNullOrEmpty(UserId))
                {
                    sqlString = $@"select *from BUSINESS_CALENDAR_MASTER_1925 where CALENDAR_CODE='{calendarCode ?? ""}'";
                }
                else
                {
                    sqlString = $@"select calendar.* from BUSINESS_ASSIGNED_USERS_1964 f
                                join USER_MASTER_1915 um on um.Id = f.ASSIGNED_USER
                                join BUSINESS_COMPANY_MASTER_1924 company on company.Id = f.COMPANY_ID
                                Join BUSINESS_CALENDAR_MASTER_1925 calendar on calendar.COMPANY_CODE = company.COMPANY_CODE
                                where um.Id = {UserId} and calendar.CALENDAR_CODE = '{calendarCode}'";
                }

                var result = (await sqlFunction.ExecuteSqlQuery(sqlString)).FirstOrDefault();
                if (result != null)
                {
                    string categoryId = result["CALENDAR_CATEGORY_ID"]?.ToString() ?? "";

                    sqlString = $@"select *from CALENDAR_CATEGORY_MASTER_1929 where Id = {categoryId}";

                    var category = (await sqlFunction.ExecuteSqlQuery(sqlString)).FirstOrDefault();
                    result.Add("category", category);

                    return new AddUpdateDelete() { Data = result, Message = AppMessage.Success, Status = true };

                }

                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
            }

        }


        public async Task<AddUpdateDelete> GetUserCoinBalance(string UserId, string CompanyCode, string CalendarCode)
        {
            try
            {
                string query = $@"select 
	                                case when (
		                                (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 f join ORDER_MASTER_1969 ord on ord.ORDER_NO = f.PAYMENT_ID where f.USER_ID = N'{UserId}' and f.CALENDAR_CODE = '{CalendarCode}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and ord.ORDER_TYPE = 'PACKAGE') - SUM(led.DEBIT_COIN)
	                                ) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 f join ORDER_MASTER_1969 ord on ord.ORDER_NO = f.PAYMENT_ID where f.USER_ID = N'{UserId}' and f.CALENDAR_CODE = '{CalendarCode}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and ord.ORDER_TYPE = 'PACKAGE') - SUM(led.DEBIT_COIN) <= 0
	                                then
		                                0
	                                else
		                                (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 f join ORDER_MASTER_1969 ord on ord.ORDER_NO = f.PAYMENT_ID where  f.USER_ID = N'{UserId}' and f.CALENDAR_CODE = '{CalendarCode}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE and ord.ORDER_TYPE = 'PACKAGE') - SUM(led.DEBIT_COIN)
	                                end as 'COIN_BALANCE'
                                FROM LEDGER_MASTER_1957 led 
                                join ORDER_MASTER_1969 ord on ord.ORDER_NO = led.ORDER_NO
                                where led.USER_ID = N'{UserId}' and ord.ORDER_TYPE = 'PACKAGE'  and led.COMPANY_CODE = '{CompanyCode}' and led.CALENDAR_CODE = '{CalendarCode}'";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    if (string.IsNullOrEmpty(result[0]["COIN_BALANCE"]?.ToString()))
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = 0 };
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result[0]["COIN_BALANCE"] };
                    }

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




        public async Task<AddUpdateDelete> SessionReview(SessionReview model)
        {
            if (String.IsNullOrEmpty(model.CALENDAR_CODE))
            {
                return new AddUpdateDelete() { Status = false, Message = "Please enter calander code" };
            }

            if (String.IsNullOrEmpty(model.COMPANY_CODE))
            {
                return new AddUpdateDelete() { Status = false, Message = "Please enter company code" };
            }

            if (model.REVIEW_SCORE <= 0)
            {
                return new AddUpdateDelete() { Status = false, Message = "review score is required" };
            }



            string query = $@"select * from TRANSACTION_MASTER_1942 t
                            join PARTICIPANT_MASTER_1940 participant on participant.Id = t.STUDENT
                            where t.SLOT = '{model.EVENT_ID}' and participant.STUDENT_ID = N'{model.USER_ID}'";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                query = $@"select * from SESSION_REVIEWS_1983 where EVENT_ID = '{model.EVENT_ID}' and USER_ID = N'{model.USER_ID}'";
                var result2 = await sqlFunction.ExecuteSqlQuery(query);

                if (result2.Count == 0)
                {
                    Form_DataTable data2 = new Form_DataTable();
                    data2.action = (int)FormAction.Save;
                    data2.formId = (int)FormSetting.SESSION_REVIEWS;

                    data2.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(model.ToDictionary());
                    data2.formGroupKey = Guid.NewGuid().ToString();
                    var formResult2 = (await formAPIRepository.GeneratedFormData(data2)).Data;

                    if (formResult2.res == 1)
                    {
                        return new AddUpdateDelete() { Status = true, Message = "Thanks for the review!", Data = formResult2 };
                    }
                    else
                    {
                        return new AddUpdateDelete { Status = false, Message = "Failed to add your review at the moment. Please try again later." };
                    }

                }
                else
                {
                    return new AddUpdateDelete { Status = false, Message = "You have already reviewed this session." };
                }

            }
            else
            {
                return new AddUpdateDelete() { Status = false, Message = "Transaction Not Allowed" };
            }

        }




        public async Task<ModifiedMyBooking> GetMyBookingsDetails(string email, string EventId = null)
        {


            string sqlString = $@"DECLARE @retval nvarchar(max);       DECLARE @sQuery nvarchar(max); DECLARE @ParmDefinition nvarchar(max);                        
                                    DECLARE @customTitleQuery nvarchar(max);
                                   

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
									left join SESSION_REVIEWS_1983 review on review.EVENT_ID = transaction_m.SLOT and review.USER_ID = participant_m.STUDENT_ID
                                    where 
                                     f.formid=2305 and participant_m.EMAIL = '{email}' and transaction_m.SLOT = f.Id  and f.Id = '{EventId}'
                                    ),  cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1	 where len(customtitle)>0  )                                    

                                        select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= (select min(ROWNUMBER) from #temptable);   
                                        select @counter = (select max(ROWNUMBER) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                                        SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';   
                                        EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT; update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end  select* from #temptable order by cast([start] as datetime) desc
                                    
                                     ";

            var MyBooking = (await sqlFunction.ExecuteSqlQuery<MyBooking>(sqlString)).ToList();
            if (MyBooking.Any())
            {
                var modifiedData = modifiedDataUpcomingEvent(MyBooking).FirstOrDefault();

                modifiedData.COMPANY_LOGO_PATH = GetFilepath(modifiedData.COMPANY_LOGO_PATH);
                if (modifiedData.DOWNLOAD_FILE_LIST != null && modifiedData.DOWNLOAD_FILE_LIST is string downloadFileListString)
                {
                    modifiedData.DOWNLOAD_FILE_LIST = JsonConvert.DeserializeObject<dynamic[]>(modifiedData.DOWNLOAD_FILE_LIST.ToString());

                }
                else
                {
                    modifiedData.DOWNLOAD_FILE_LIST = new List<DownloadFile>();
                }



                var customFormsSplit = modifiedData.customForms.Split(',').ToList();
                var customFormIdsSplit = modifiedData.customFormIds.Split(',').ToList();
                var customTitleSplit = modifiedData.customTitle.Split(',').ToList();
                string locamaster = ((int)FormSetting.LOCATION_MASTER).ToString();
                List<EventFormDataList> eventFormDatas = new List<EventFormDataList>();
                foreach (var item in customFormsSplit)
                {


                    int index = customFormsSplit.FindIndex(x => x == item);
                    string title = "";
                    string id = "";
                    if (customTitleSplit.Count > index)
                    {
                        title = customTitleSplit[index];
                    }
                    if (customFormIdsSplit.Count > index)
                    {
                        id = customFormIdsSplit[index];
                    }
                    EventFormDataList formData = new EventFormDataList()
                    {
                        title = title,
                        id = id,
                        formid = item,
                        seq = 1
                    };
                    eventFormDatas.Add(formData);
                }

                modifiedData.eventFormDatas = eventFormDatas;





                return modifiedData;
            }
            else
            {
                return new ModifiedMyBooking();
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
            string filterQuery = CustomMethods.GetDateQuery(calendarRequest.start, calendarRequest.end);

            string fiterstring = "";

            if (!string.IsNullOrEmpty(calendarRequest.COMPANY_CODE))
            {
                fiterstring += " and F.COMPANY_CODE=N'" + calendarRequest.COMPANY_CODE + "'";
            }


            if (!string.IsNullOrEmpty(calendarRequest.CALENDAR_CODE))
            {
                fiterstring += "' and F.CALENDAR_CODE=N'" + calendarRequest.CALENDAR_CODE + "'";
            }

            data.filter = new FilterDTO() { field = "start", value = filterQuery + fiterstring };
            //data.filter = new FilterDTO() { field = "start", value = filterQuery + " and F.COMPANY_CODE=N'" + calendarRequest.COMPANY_CODE + "' and F.CALENDAR_CODE=N'" + calendarRequest.CALENDAR_CODE + "'" };

            ReferalFormDataResponseModel result = await formAPIRepository.getReferralFormFields(data);

            if (result != null && result.events != null)
            {
                return result.events;
            }
            return new List<IDictionary<string, object>>();
        }


        public async Task<List<EventLIst>> GetCalnderEvents(CalendarEvents Request)
        {
            try
            {
                List<EventLIst> EventData = new List<EventLIst>();
                Form_DataTable data = new Form_DataTable();
                data.action = 1;
                data.ActivityFormId = (int)FormSetting.SERVICE_MASTER;
                data.resourceFormId = (int)FormSetting.LOCATION_MASTER;
                data.isEvent = 1;
                data.isCalender = 1;
                data.formId = (int)FormSetting.CALENDAR_FORM;
                data.COMPANY_CODE = Request.COMPANY_CODE;
                data.CALENDAR_CODE = Request.CALENDAR_CODE;
                string filterQuery = CustomMethods.GetDateQuery(Request.start, Request.end);
                data.filter = new FilterDTO() { field = "start", value = filterQuery };
                if (!string.IsNullOrEmpty(data?.COMPANY_CODE) || !string.IsNullOrEmpty(data?.CALENDAR_CODE))
                {
                    data.filter.value = " F.COMPANY_CODE=N'" + data.COMPANY_CODE + "' and F.CALENDAR_CODE=N'" + data.CALENDAR_CODE + "' and " + data.filter.value;
                }

                ReferalFormDataResponseModel result = await formAPIRepository.getReferralFormFields(data);

                if (result != null && result.events != null)
                {

                    //List<Event> events = JsonConvert.DeserializeObject<List<Event>>(JsonConvert.SerializeObject(result.events));
                    //var groupedEvents = events.GroupBy(e => e.Start.Date)
                    //                          .Select(g => new
                    //                          {
                    //                              Date = g.Key,
                    //                              Times = g.Select(e => e.Start.ToString("HH:mm")).Distinct().ToList()
                    //                          })
                    //                          .ToList();

                    //foreach (var group in groupedEvents)
                    //{
                    //    List<EventTiming> timing = new List<EventTiming>();                        
                    //    var Date = group.Date.ToString("yyyy-MM-dd");
                    //    group.Times.ForEach(time => timing.Add(new EventTiming { Timeing = time }));
                    //    EventData.Add(new EventLIst { Date = Date, _EventTiming = timing });
                    //}


                    ////return groupedEvents.ToList();



                    //List<Event> events = JsonConvert.DeserializeObject<List<Event>>(JsonConvert.SerializeObject(result.events));

                    //var groupedEvents = events.GroupBy(e => e.Start.Date)
                    //                          .Select(g => new EventLIst
                    //                          {
                    //                              Date = g.Key.ToString("yyyy-MM-dd"),
                    //                              EventTimes = g.Select(e => new EventTiming { Timeing = e.Start.ToString("HH:mm") })
                    //                                             .Distinct()
                    //                                             .ToList()
                    //                          })
                    //                          .ToList();
                    //return groupedEvents;


                    List<Event> events = JsonConvert.DeserializeObject<List<Event>>(JsonConvert.SerializeObject(result.events));

                    var groupedEvents = events.GroupBy(e => e.Start.Date)
                                              .Select(g => new EventLIst
                                              {
                                                  Date = g.Key.ToString("yyyy-MM-dd"),
                                                  EventTimes = g.Select(e => new EventTiming
                                                  {
                                                      Timeing = e.Start.ToString("hh:mm tt")
                                                  })
                                                                .Distinct()
                                                                .ToList()
                                              })
                                              .ToList();
                    return groupedEvents;







                }
                return new List<EventLIst>();
            }
            catch (Exception ex)
            {
                return new List<EventLIst>();
            }
        }



        public async Task<AddUpdateDelete> GetcalanderDetails(FavoriteCalendarViewModel model)
        {
            try
            {
                string query = $@"select *from(SELECT distinct calendar.[Id]
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
                         where  calendar.CALENDAR_CODE='CLR00101' and   company.COMPANY_CODE='CMP00079' ) as t ";

                List<IDictionary<string, object>> result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {

                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result.FirstOrDefault() };



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



        public class Event
        {
            public int ROWNUMBER { get; set; }
            public int Id { get; set; }
            public string FormGroupKey { get; set; }
            public int FormID { get; set; }
            public int UserID { get; set; }
            public string Current_Status { get; set; }
            public int Cycle { get; set; }
            public int MasterFormID { get; set; }
            public string MasterFormRow { get; set; }
            public int FormRecordOrder { get; set; }
            public int FormRecordStatus { get; set; }
            public string ApprovalStatus { get; set; }
            public string COMPANY_CODE { get; set; }
            public string CALENDAR_CODE { get; set; }
            public string Hidden_Fullcalendar { get; set; }
            public string SchedulerFormGroupKey { get; set; }
            public string Title { get; set; }
            public DateTime Start { get; set; }
            public DateTime End { get; set; }
            public string AllDay { get; set; }
            public string Resources { get; set; }
            public string Activities { get; set; }
            public string Description { get; set; }
            public string Color { get; set; }
            public DateTime Created_At { get; set; }
            public DateTime Updated_At { get; set; }
            public string Created_By { get; set; }
            public string Updated_By { get; set; }
            public string ResForm_2304 { get; set; }
            public string ActFormID { get; set; }
            public string ParentID { get; set; }
            public string SeperatedFormIDs { get; set; }
            public string SeperatedTitles { get; set; }
            public string SeperatedIds { get; set; }
            public string SeperatedResFormIDs { get; set; }
            public string SeperatedResEntryIDs { get; set; }
            public string SeperatedResColValues { get; set; }
            public string SeperatedColorValues { get; set; }
            public string Tabulator_1683726769059 { get; set; }
            public string Tabulator_1683785383381 { get; set; }
            public string SCHEDULAR_FORM_ID { get; set; }
            public string CREATION_TYPE { get; set; }
            public string SLOT_DURATION_IN_MINS { get; set; }
            public string EVENT_TYPE { get; set; }
            public string COMPANY_SUBSCRIPTION_ID { get; set; }
            public string IS_UPLOAD_REQUIRED { get; set; }
            public string UPLOAD_TIME { get; set; }
            public string DOWNLOADABLE_ATTACHMENT { get; set; }
            public string DOWNLOAD_FILE_LIST { get; set; }
            public string IS_COURSE_EVENT { get; set; }
            public string ResourceId { get; set; }
            public string CustomFourthTitle { get; set; }
            public string CustomTitle { get; set; }
            public string CustomForms { get; set; }
            public string CustomFormIds { get; set; }
            public string Referrences_1 { get; set; }
            public string Referrences_2 { get; set; }
            public string Referrences_3 { get; set; }
        }



        public class companyList
        {
            public string COMPANY_CODE { get; set; }
        }

        public async Task<List<IDictionary<string, object>>> GetUserEvents(UserEventsViewmodel model, string userEmail)
        {

            string sqlString = $@"SELECT distinct calendar.[COMPANY_CODE]
                                  FROM [dbo].[CALENDAR_FORM_1935] calendar
                                  join TRANSACTION_MASTER_1942 transaction_m on calendar.CALENDAR_CODE = transaction_m.CALENDAR_CODE and calendar.Id = transaction_m.SLOT
                                  join PARTICIPANT_MASTER_1940 participant on participant.Id = transaction_m.STUDENT
                                  join USER_MASTER_1915 um on um.[USER_ID]=participant.STUDENT_ID
                                  join BUSINESS_CALENDAR_MASTER_1925 c on c.CALENDAR_CODE=calendar.CALENDAR_CODE
								  join BUSINESS_COMPANY_MASTER_1924 company on company.COMPANY_CODE = calendar.COMPANY_CODE
                                  where um.USER_EMAIL = '{userEmail}'";
            var result = (await sqlFunction.ExecuteSqlQuery<companyList>(sqlString)).ToList();
            string companycode = "'" + string.Join("','", result.Select(x => x.COMPANY_CODE)) + "'";

            var calendarRequest = new CalendarRequestModel() { COMPANY_CODE = companycode, start = model.start, end = model.end };

            Form_DataTable data = mapper.Map<Form_DataTable>(calendarRequest);
            data.IsPublicUser = true;
            data.action = 1;
            data.ActivityFormId = (int)FormSetting.SERVICE_MASTER;
            data.resourceFormId = (int)FormSetting.LOCATION_MASTER;
            data.isEvent = 1;
            data.IsCustomInFilter = true;
            data.isCalender = 1;
            data.formId = (int)FormSetting.CALENDAR_FORM;
            string filterQuery = CustomMethods.GetDateQuery(calendarRequest.start, calendarRequest.end);
            data.filter = new FilterDTO() { field = "start", value = filterQuery };
            List<CustomFilter> _customFilters = new List<CustomFilter>();
            _customFilters.Add(new CustomFilter() { FieldName = "COMPANY_CODE", Value = calendarRequest.COMPANY_CODE });
            data.CustomFilters = _customFilters;
            ReferalFormDataResponseModel eventsResult = await formAPIRepository.getReferralFormFields(data);

            if (result != null && eventsResult.events != null)
            {
                await commonService.ModifyEventsData(data, eventsResult, userEmail);
                return eventsResult.events;
            }
            return new List<IDictionary<string, object>>();
        }

        public async Task<AddUpdateDelete> GetCalendarFilters(int FilterType, string CompanyCode, string CalendarCode)
        {
            try
            {
                if (FilterType == 1)
                {
                    // return calendar filter master
                    var calendarData = await GetCalendarsByCompanyCode(CompanyCode);

                    List<CalendarFilterModel> calendarFilter = new List<CalendarFilterModel>();

                    if (calendarData.Status)
                    {
                        var calendarDataRaw = calendarData.Data as List<CalendarModel>;

                        calendarDataRaw.ForEach(x =>
                        {
                            calendarFilter.Add(new CalendarFilterModel()
                            {
                                Id = x.Id,
                                Name = x.CALENDAR_NAME + " (" + x.CALENDAR_CODE + ")",
                                Code = x.CALENDAR_CODE
                            });
                        });

                    }

                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = calendarFilter };
                }
                else
                {
                    var dataModel = new calenderSettingsFormDetails()
                    {
                        action = 4,
                        formId = 2305,
                        IsCustomFilter = true,
                        CustomFilters = new List<CustomFilter>()
                        {
                            new CustomFilter()
                            {
                                FieldName = "COMPANY_CODE",
                                Value = CompanyCode
                            },
                            new CustomFilter()
                            {
                                FieldName = "CALENDAR_CODE",
                                Value = CalendarCode
                            }
                        }
                    };

                    var rawData = await formAPIRepository.getCalenderSettingsFormData(dataModel);

                    if (rawData != null && rawData.Count() > 0)
                    {

                        if (FilterType == 2)
                        {
                            // return service filter master
                            var filterData = rawData.FirstOrDefault(x => x.activitiesForm != 0 && x.IsDefault).formDataList;

                            List<CalendarFilterModel> serviceFilter = new List<CalendarFilterModel>();

                            if (filterData != null && filterData.Count > 0)
                            {
                                filterData.ForEach(x =>
                                {
                                    serviceFilter.Add(new CalendarFilterModel()
                                    {
                                        Id = Convert.ToInt32(x["id"]?.ToString()),
                                        Name = x["ACTIVITY_NAME"]?.ToString(),
                                        Code = x["ACTIVITY_CODE"]?.ToString()
                                    });
                                });
                            }

                            return new AddUpdateDelete() { Status = true, Message = "Success", Data = serviceFilter };
                        }
                        else if (FilterType == 3)
                        {
                            // return service provider filter master
                            var filterData = rawData.FirstOrDefault(x => x.resourceForm == 2304).formDataList;

                            List<CalendarFilterModel> serviceProviderFilter = new List<CalendarFilterModel>();

                            if (filterData != null && filterData.Count > 0)
                            {
                                filterData.ForEach(x =>
                                {
                                    serviceProviderFilter.Add(new CalendarFilterModel()
                                    {
                                        Id = Convert.ToInt32(x["id"]?.ToString()),
                                        Name = x["FIRST_NAME"]?.ToString() + " " + x["FIRST_NAME"]?.ToString() + x["CHINESE_NAME"]?.ToString(),
                                        Code = x["RESOURCE_CODE"]?.ToString()
                                    });
                                });
                            }

                            return new AddUpdateDelete() { Status = true, Message = "Success", Data = serviceProviderFilter };
                        }
                        else
                        {
                            // return location filter master
                            var filterData = rawData.FirstOrDefault(x => x.resourceForm == 2306).formDataList;
                            List<CalendarFilterModel> locationFilter = new List<CalendarFilterModel>();

                            if (filterData != null && filterData.Count > 0)
                            {
                                filterData.ForEach(x =>
                                {
                                    locationFilter.Add(new CalendarFilterModel()
                                    {
                                        Id = Convert.ToInt32(x["id"]?.ToString()),
                                        Name = x["LOCATION_ADDRESS"]?.ToString(),
                                        Code = x["LOCATION_CODE"]?.ToString()
                                    });
                                });
                            }

                            return new AddUpdateDelete() { Status = true, Message = "Success", Data = locationFilter };
                        }
                    }
                    else
                    {
                        return new AddUpdateDelete() { Status = true, Message = "No data found", Data = null };
                    }
                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = "Something went wrong.", Data = null };
            }
        }

        public async Task<List<MyFavouriteCompany>> GetMyfavoriteCompanyList(string userName)
        {
            try
            {

                string query = $@"declare @CompanyCodes varchar(max) = (select stuff((select distinct ',' + COMPANY_CODE  from PAYMENT_HISTORY_MASTER_1956 payment 
											  where payment.STATUS = 'complete' and payment.USER_ID = N'{userName}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd")}' < payment.CREDIT_EXPIRE_DATE
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
                                      where favorite.USER_ID = N'{userName}' and company.COMPANY_CODE not in (select cast(item as varchar) from dbo.SplitString(@CompanyCodes, ','))";

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

                string Fev_query = $@"SELECT [Id],[created_at],[updated_at],[created_by],[updated_by],[COMPANY_CODE],[CALENDAR_CODE],[USER_ID],[IS_PUBIC_USER] FROM [dbo].[FAVORITE_CALENDAR_MASTER_1949] where USER_ID = N'{userId}'";

                List<IDictionary<string, object>> Fev_result = await sqlFunction.ExecuteSqlQuery(Fev_query);

                string calendarCodes = "";
                string FilterString = "";

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



                if (!string.IsNullOrEmpty(data.CalendarCode) && !string.IsNullOrEmpty(data.COMPANY_CODE))
                {
                    FilterString = " WHERE  COMPANY_CODE='" + data.COMPANY_CODE + "' AND CALENDAR_CODE='" + data.CalendarCode + "'";
                }
                else if (!string.IsNullOrEmpty(data.CalendarCode))
                {
                    FilterString = " WHERE  CALENDAR_CODE='" + data.CalendarCode + "'";
                }
                else if (!string.IsNullOrEmpty(data.COMPANY_CODE))
                {
                    FilterString = " WHERE  COMPANY_CODE='" + data.COMPANY_CODE + "'";
                }




                int PageSize = data.size > 0 ? data.size : 20;
                int PageNumber = data.page > 0 ? data.page : 1;

                string query = $@"declare @CalendarCodes varchar(max) = (select stuff((select distinct ',' + CALENDAR_CODE  from PAYMENT_HISTORY_MASTER_1956 payment 
											  where payment.STATUS = 'complete' and payment.USER_ID = N'{userId}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd")}' < payment.CREDIT_EXPIRE_DATE
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
		                                                        (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = N'{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN)
	                                                        ) is null or (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = N'{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE) - SUM(led.DEBIT_COIN) <= 0
	                                                        then
		                                                        0
	                                                        else
		                                                        (select sum(B_COIN_PURCHASE) from PAYMENT_HISTORY_MASTER_1956 pay join ORDER_MASTER_1969 ord on ord.ORDER_NO = pay.PAYMENT_ID where ord.ORDER_TYPE = 'PACKAGE' and pay.USER_ID = N'{userId}' and pay.CALENDAR_CODE = calendarDetails.CALENDAR_CODE and '{DateTimeUtility.Now().ToString("yyyy-MM-dd HH:mm")}' < CREDIT_EXPIRE_DATE)
	                                                        end
                                                        FROM LEDGER_MASTER_1957 led 
                                                        join ORDER_MASTER_1969 ord on ord.ORDER_NO = led.ORDER_NO
                                                        where ord.ORDER_TYPE = 'PACKAGE' and led.USER_ID = N'{userId}' and led.CALENDAR_CODE = calendarDetails.CALENDAR_CODE ) as 'COIN_BALANCE', 'Y' as 'PURCHASED'
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
                                              where {((string.IsNullOrEmpty(calendarCodes)) ? "calendarDetails.CALENDAR_CODE = ''" : $@"calendarDetails.CALENDAR_CODE in ({calendarCodes})")} and calendarDetails.CALENDAR_CODE not in (select cast(item as varchar) from dbo.SplitString(@CalendarCodes, ','))
                                      )
                                  Select COUNT(*) OVER() total_records,@PageSize size, @PageNumber as 'page',* from formdata {FilterString}  ORDER BY PURCHASED desc OFFSET @PageSize * (@PageNumber - 1) ROWS   FETCH NEXT @PageSize ROWS ONLY OPTION(RECOMPILE);";


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
                                    WHERE USER_ID = N'{userName}' 
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
                                WHERE USER_ID=N'{userName}' ";

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

                if (data.COMPANY_CODE != "")
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
                                            WHERE           f.id!=0  and USER_ID=N'{userName}' {searchFilter}   )
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


        public async Task<AddUpdateDeleteAPI> AddToFavoriteCalendar(FavoriteCalendarViewModel model, string UserId)
        {
            string query = $@"select * from FAVORITE_CALENDAR_MASTER_1949 where USER_ID = N'{UserId}' and CALENDAR_CODE = '{model.CALENDAR_CODE}' and COMPANY_CODE = '{model.COMPANY_CODE}'";

            var result = await sqlFunction.ExecuteSqlQuery(query);

            if (result.Count > 0)
            {
                return new AddUpdateDeleteAPI() { Message = AppMessage.Success, Status = true };
            }

            FavoriteCalendarModel Favmodel = new FavoriteCalendarModel();
            Favmodel.CALENDAR_CODE = model.CALENDAR_CODE;
            Favmodel.COMPANY_CODE = model.COMPANY_CODE;
            Favmodel.USER_ID = UserId;
            Favmodel.IS_PUBLIC_USER = "Y";
            Form_DataTable data = new Form_DataTable();
            data.action = (int)FormAction.Save;
            data.formId = (int)FormSetting.FAVORITE_CALENDAR_MASTER;

            data.formfieldDataListTemp = CustomMethods.ConvertDicToNameValuePair(Favmodel.ToDictionary());
            data.formGroupKey = Guid.NewGuid().ToString();
            var Result = (await formAPIRepository.GeneratedFormData(data)).Data;

            if (Result.res == 1)
            {
                return new AddUpdateDeleteAPI() { Message = AppMessage.Success, Status = true };//Data = formResult.Id.ToString()
            }
            else
            {
                return new AddUpdateDeleteAPI() { Message = Result.Message, Status = false };
            }
        }



        public async Task<AddUpdateDelete> RemoveFavoriteCalendar(FavoriteCalendarViewModel model, string UserId)
        {
            try
            {

                string query = $@"delete from FAVORITE_CALENDAR_MASTER_1949 where USER_ID = N'{UserId}' and CALENDAR_CODE = '{model.CALENDAR_CODE}' and COMPANY_CODE = '{model.COMPANY_CODE}'";

                int result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (result > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = AppMessage.Success, Data = result };
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




        public async Task<FavouriteCalendarDetails> CalendarDtails(FavoriteCalendarViewModel model, string UserId)
        {
            try
            {

                string query = $@"select [Id]      
                                  ,[CALENDAR_NAME]
                                  ,[CALENDAR_PHOTO_NAME]
                                  ,[CALENDAR_PHOTO_PATH]
                                  ,[IS_VISIBLE]
                                  ,[COUNTRY_ID]
                                  ,[CITY_ID]
                                  ,[DISTRICT_ID]
                                  ,[CALENDAR_CATEGORY_ID]
                                  ,[CALENDAR_SUB_CATEGORY_ID]
                                  ,[COMPANY_CODE]
                                  ,[CALENDAR_CODE]
                                  ,[TAGS]
                                  ,[SLOT_DURATION_IN_MINS]
                                  ,[CAL_CURRENT_STEP]
                                  ,[CALENDAR_TYPE]
                                  ,[CALENDAR_FUNCTION_TYPE]
                                  ,[CALENDAR_USE_TYPE]
                                  ,[DISPLAY_MIN_TIME]
                                  ,[DISPLAY_MAX_TIME]
                                  ,[DEFAULT_RESOURCE]
                                  ,[ADDITIONAL_FORM_ID]
                                  ,[NEED_ADDITIONAL_FORM]
                                  ,[DEFAULT_CALENDAR_VIEW]
                                  ,[REQUIRED_CALENDAR_VIEWS]
                                  ,[CALENDAR_COMMON_CATEGORY_ID]
                                  ,[IS_VISIBLE_ON_MARKETPLACE_HOME]
                                  ,[PRIORITY]
                                  ,[IS_FEATURED]
                                  ,[SEQUENCE]
                                  ,[STATUS]      
                                  ,[INTERVAL_TIME]
                                  ,[DEFAULT_DISPLAY_DATE]
                                  ,[DEFAULT_DATE]
                                  ,[SERVICE_CHARGE_BY]
	                              ,case when  (select top 1 count(Id) from FAVORITE_CALENDAR_MASTER_1949 where COMPANY_CODE='{model.COMPANY_CODE}' and CALENDAR_CODE='{model.CALENDAR_CODE}' and USER_ID=N'{UserId}')=1
                                   OR (SELECT Count(distinct company.Id) FROM [dbo].[BUSINESS_COMPANY_MASTER_1924] company join PAYMENT_HISTORY_MASTER_1956 p on p.COMPANY_CODE=company.COMPANY_CODE
									   where p.STATUS = 'complete' and p.USER_ID = N'{UserId}' and '{DateTimeUtility.Now().ToString("yyyy-MM-dd")}' < p.CREDIT_EXPIRE_DATE and p.COMPANY_CODE='{model.COMPANY_CODE}' and p.CALENDAR_CODE='{model.CALENDAR_CODE}')=1
                                   then 'Y' else 'N' end as IsFavourite
                                  ,[ALLOW_OVERLAP] from BUSINESS_CALENDAR_MASTER_1925  
	                                where  COMPANY_CODE='{model.COMPANY_CODE}' and  CALENDAR_CODE='{model.CALENDAR_CODE}'";

                var result = (await sqlFunction.ExecuteSqlQuery<FavouriteCalendarDetails>(query)).FirstOrDefault();
                if (result != null)
                {

                    result.CALENDAR_PHOTO_PATH = GetFilepath(result.CALENDAR_PHOTO_PATH);

                    return result;
                }
                else
                {
                    return new FavouriteCalendarDetails();
                }

            }
            catch (Exception ex)
            {
                return new FavouriteCalendarDetails();
            }
        }


        public async Task<EventDetails> GetSingleEventDetails(string EventId)
        {
            string query = $@"DECLARE @retval nvarchar(max);       DECLARE @sQuery nvarchar(max); DECLARE @ParmDefinition nvarchar(max);                        
                            DECLARE @customTitleQuery nvarchar(max);                          
                            IF OBJECT_ID(N'tempdb..#temptable') IS NOT NULL  BEGIN DROP TABLE #temptable END   ;with cte1 as( select distinct  f.*,f.resources 'resourceId'  ,  STUFF((SELECT ',' +  PARTICIPANT_MASTER_1940.[STUDENT_NAME]  
                            from TRANSACTION_MASTER_1942 inner join PARTICIPANT_MASTER_1940 on TRANSACTION_MASTER_1942.STUDENT = PARTICIPANT_MASTER_1940.Id where TRANSACTION_MASTER_1942.formGroupKey = f.formGroupKey         FOR XML PATH('')), 1, 1, '') customFourthTitle
                            , (dbo.[GetSubQueryCalender](f.formGroupKey)) customTitle,   (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceFormId) from form_calenderreferrence f2     
                            where f2.formgroupkey = f.formGroupKey  FOR XML PATH('')), 1, 1, '')   ) customForms  , (  select STUFF((SELECT ',' + convert(nvarchar, f2.referrenceId) from form_calenderreferrence f2    
                            where f2.formgroupkey = f.formGroupKey   FOR XML PATH('')), 1, 1, '')   ) customFormIds,  '' referrences_1,  '' referrences_2,  '' referrences_3 , service_m.fees_1
                            from CALENDAR_FORM_1935 f   
                            join SERVICE_MASTER_1933 service_m on service_m.Id = f.activities
                            where f.Id = {EventId} and f.formid=2305   ) ,
                            cte2 as ( select ROW_NUMBER() OVER(ORDER BY Id) ROWNUMBER , * from cte1	 where len(customtitle)>0) 
                            select* into #temptable from cte2  where len(customtitle)>0;    declare @counter int= 0, @c int= 1;   
                            select @counter = (select count(1) from #temptable)	while @c <= @counter    begin    select @customTitleQuery = customTitle from #temptable where ROWNUMBER=@c;	SET @sQuery= ' select @retvalOUT = (' + @customTitleQuery + ')'  
                            SET @ParmDefinition = N'@retvalOUT nvarchar(max) OUTPUT';   
                            EXEC sp_executesql @sQuery, @ParmDefinition, @retvalOUT = @retval OUTPUT;    update #temptable set customTitle=@retval where ROWNUMBER=@c;	set @c = @c + 1;  end  select* from #temptable";


            var result = (await sqlFunction.ExecuteSqlQuery<EventDetails>(query)).FirstOrDefault();
            if (result != null)
            {

                var customFormsSplit = result.customForms.Split(',').ToList();
                var customFormIdsSplit = result.customFormIds.Split(',').ToList();
                var customTitleSplit = result.customTitle.Split(',').ToList();

                string locamaster = ((int)FormSetting.LOCATION_MASTER).ToString();

                List<EventFormData> eventFormDatas = new List<EventFormData>();
                foreach (var item in customFormsSplit)
                {


                    int index = customFormsSplit.FindIndex(x => x == item);
                    string title = "";
                    string id = "";
                    if (customTitleSplit.Count > index)
                    {
                        title = customTitleSplit[index];
                    }
                    if (customFormIdsSplit.Count > index)
                    {
                        id = customFormIdsSplit[index];
                    }
                    EventFormData formData = new EventFormData()
                    {
                        title = title,
                        id = id,
                        formid = item,
                        seq = 1
                    };
                    eventFormDatas.Add(formData);
                }

                result.eventFormDatas = eventFormDatas;


                return result;
            }
            else
            {
                return new EventDetails();
            }
        }
        #endregion



        #region

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
                                  ,[VALIDITY_IN_MONTHS]
                              FROM [dbo].[CALENDAR_PACKAGE_MASTER_1952] where Id = '{PackageId}'";
                var result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = "Success", Data = result.FirstOrDefault() };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "No Package found" };
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
                    var query = $@"update ORDER_MASTER_1969 set ORDER_NO = '{OrderNo}' where Id = '{formResult.Id.ToString()}'";
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
        #endregion


        public async Task<AddUpdateDelete> UpdateUserProfileData(UpdateUserProfileModel model)
        {
            try
            {

                string subQuery = "";
                string ChQuery = "";

                ChQuery = $@"select USER_EMAIL from USER_MASTER_1915 where USER_EMAIL='{model.USER_EMAIL}' and USER_ID !='{model.USER_ID}'";

                List<IDictionary<string, object>> Email = await sqlFunction.ExecuteSqlQuery(ChQuery);

                if (Email.Count > 0)
                {

                    return new AddUpdateDelete() { Status = false, Message = "This email addres is already in use with diffrent user" };
                }

                if (!string.IsNullOrEmpty(model.USER_PHONE))
                {
                    ChQuery = $@"select USER_PHONE from USER_MASTER_1915 where USER_PHONE='{model.USER_PHONE}' and USER_ID !='{model.USER_ID}'";

                    List<IDictionary<string, object>> Mobile = await sqlFunction.ExecuteSqlQuery(ChQuery);

                    if (Mobile.Count > 0)
                    {
                        return new AddUpdateDelete() { Status = false, Message = "This Phone number is already in use with diffrent user" };
                    }
                }


                string dateofbirth = "NULL";
                if (model.DATE_OF_BIRTH.HasValue)
                {
                    dateofbirth = "'" + model.DATE_OF_BIRTH.Value.ToString("yyyy-MM-dd") + "'";
                }

                string query = $@"update PUBLIC_USER_ACCOUNT_1943 set FIRST_NAME = N'{SQLUtility.TreatSingleQuoteForQuery(model.FIRST_NAME)}', LAST_NAME = N'{SQLUtility.TreatSingleQuoteForQuery(model.LAST_NAME)}', CHINESE_NAME = N'{SQLUtility.TreatSingleQuoteForQuery(model.CHINESE_NAME)}', NICK_NAME = N'{SQLUtility.TreatSingleQuoteForQuery(model.NICK_NAME)}', GENDER = '{model.GENDER}', DATE_OF_BIRTH = {dateofbirth} where USER_ID = N'{model.USER_ID}'";

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
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> CheckRegisteredPhoneNo(RequestMobileNoChangeOTPViewModel model, string User_Id)
        {
            try
            {
                AddUpdateDelete response = new AddUpdateDelete() { Data = null, Message = "Change type not defined", Status = false };

                // check phone
                string query = $@"select * from USER_MASTER_1915 where USER_ID != N'{User_Id}' and USER_PHONE = '{model.New_Phone}' and COUNTRY_CODE = '{model.Country_Code}'";

                var result = await sqlFunction.ExecuteSqlQuery(query);

                if (result.Count > 0)
                {
                    response.Message = "Phone No. already registered!";
                }
                else
                {
                    response.Message = "Success";
                    response.Status = true;
                }

                return response;
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }


        public async Task<AddUpdateDelete> changespassword(userPassword model, string USER_ID)
        {
            try
            {
                string query = $@"update USER_MASTER_1915 set  USER_PASSWORD = '{model.newpassword}' where USER_ID = N'{USER_ID}' ";

                var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (result > 0)
                {
                    return new AddUpdateDelete() { Status = true, Message = "Phone No. updated successfully!" };
                }
                else
                {
                    return new AddUpdateDelete() { Status = false, Message = "Failed to update Mobile No." };

                }
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> UpdateRegisteredPhoneNo(UpdateMobileNoViewModel model, string User_Id)
        {
            try
            {
                AddUpdateDelete response = new AddUpdateDelete() { Data = null, Message = "Change type not defined", Status = false };


                // change phone
                string query = $@"update USER_MASTER_1915 set USER_PHONE = '{model.New_Phone}', COUNTRY_CODE = '{model.Country_Code}' where USER_ID = N'{User_Id}'";

                var result = await sqlFunction.ExecuteSqlCommandQuery(query);

                if (result > 0)
                {
                    response.Message = "Phone No. updated successfully!";
                    response.Status = true;
                }
                else
                {
                    response.Message = "Failed to update Mobile No.";
                    response.Status = false;
                }

                return response;
            }
            catch (Exception ex)
            {
                return new AddUpdateDelete() { Status = false, Message = ex.Message };
            }
        }

        public async Task<AddUpdateDelete> UpdatePublicUserProfilePic(PublicAccountModel model)
        {
            string query = $@"update PUBLIC_USER_ACCOUNT_1943 set PROFILE_PHOTO_NAME = '{SQLUtility.TreatSingleQuoteForQuery(model.PROFILE_PHOTO_NAME)}', PROFILE_PHOTO_PATH = '{SQLUtility.TreatSingleQuoteForQuery(model.PROFILE_PHOTO_PATH)}' where USER_ID = N'{model.USER_ID}'";

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


        //public async Task<AddUpdateDelete> changespassword(userPassword model, string USER_ID)
        //{
        //    try
        //    {
        //        string query = $@"update USER_MASTER_1915 set  USER_PASSWORD = '{model.newpassword}' where USER_ID = N'{USER_ID}' ";

        //        int result = await sqlFunction.ExecuteSqlCommandQuery(query);

        //        if (result > 0)
        //        {
        //            return new AddUpdateDelete() { Status = true, Message = AppMessage.Success };
        //        }
        //        else
        //        {
        //            return new AddUpdateDelete() { Status = false, Message = AppMessage.NotFound };
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return new AddUpdateDelete() { Status = false, Message = ex.Message };
        //    }
        //}


    }
}
