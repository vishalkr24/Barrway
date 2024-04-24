using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Barrway.DTO.APIModels.Dashboard
{
    public class DashboardInfoData
    {
        public DashboardInfoData()
        {
            calendars = new List<RootCalendarModel>();
            feature_blogs = new List<FeatureBlogModel>();
            feature_companies = new List<FeatureCompanyModel>();
        }
        public List<RootCalendarModel> calendars { get; set; }
        public List<FeatureCompanyModel> feature_companies { get; set; }
        public List<FeatureBlogModel> feature_blogs { get; set; }
    }
    public class RootCalendarModel
    {
        public int CALENDAR_CATEGORY_ID { get; set; }
        public string CATEGORY_NAME { get; set; }
        public List<CalendarModel> CALENDAR_LIST { get; set; }
    }
    public class CalendarModel
    {
        public int Id { get; set; }
        public DateTime created_at { get; set; }
        public string CALENDAR_NAME { get; set; }
        public string CALENDAR_PHOTO_NAME { get; set; }
        public string CALENDAR_PHOTO_PATH { get; set; }
        public int CALENDAR_CATEGORY_ID { get; set; }
        public string CALENDAR_SUB_CATEGORY_ID { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string CALENDAR_SUB_CATEGORY_NAME { get; set; }
        public string CATEGORY_NAME { get; set; }
        public string DISTRICT_NAME { get; set; }
        public string TAGS { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }
        public string COMPANY_NAME_CHINESE { get; set; }
        public string COMPANY_LOGO_NAME { get; set; }
        public string COMPANY_LOGO_PATH { get; set; }
        public string COMPANY_BANNER_NAME { get; set; }
        public string COMPANY_BANNER_PATH { get; set; }
        public string PAGE_URL { get; set; }
        public string IS_FEATURED { get; set; }
    }
}