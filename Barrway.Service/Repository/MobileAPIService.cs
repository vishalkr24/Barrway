using Barrway.DTO.APIModels.Dashboard;
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
        public async Task<List<FeatureCompanyModel>> GetFeatureCompanies() {
            string sqlString = $@"select Id,COMPANY_NAME_ENGLISH +'|'+COMPANY_NAME_CHINESE AS COMPANY_NAME,COMPANY_NAME_ENGLISH,COMPANY_BANNER_PATH,COMPANY_LOGO_PATH,COMPANY_BANNER_NAME,TAGS  from BUSINESS_COMPANY_MASTER_1924 WHERE IS_FEATURED='Y'";
            var featureCompanies = (await sqlFunction.ExecuteSqlQuery<FeatureCompanyModel>(sqlString)).ToList();
            featureCompanies.ForEach(x => { x.TAGS = formatTagsString(x.TAGS);x.COMPANY_LOGO_PATH = GetFilepath(x.COMPANY_LOGO_PATH, "COMPANY"); });
            return featureCompanies;
        }

        public async Task<List<FeatureBlogModel>> GetFeatureBlogs()
        {
            string sqlString = $@"select blog.Id, blog.created_at, blog.BLOG_TITLE,blog.[IMAGE],blog.YOUTUBE_LINK,blog.TAG,blog_c.BLOG_CATEGORY,blog.BLOG_CATEGORY BLOG_CATEGORY_ID from BLOG_1980 blog
                                  join BLOG_CATEGORY_1981 blog_c on blog.BLOG_CATEGORY=blog_c.Id
                                  where blog.IS_HOT='YES'";
            var featureBlogs = (await sqlFunction.ExecuteSqlQuery<FeatureBlogModel>(sqlString)).ToList();
            featureBlogs.ForEach(x => x.TAG = formatTagsString(x.TAG));
            return featureBlogs;
        }

        private string formatTagsString(string json) {

            if (!string.IsNullOrEmpty(json) && isJsonString(json)) {
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
        private string GetFilepath(string path,string type) {

            if (!string.IsNullOrEmpty(path) && path.Contains("/"))
            {
                path = path.Replace("~", "");
                path=baseUrl+ path;
                return path;
            }
            else {
                return type=="COMPANY"?AppSettings.default_company_logopath:AppSettings.default_calernar_path;
            }
        }
    }
}
