using Barrway.DTO.APIModels.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Company
{
   

    public class Company
    {
        public int Id { get; set; }
        public string IS_TEMPLATE { get; set; }
        public string TEMPLATE_ID { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string PALETTE_ID { get; set; }
        public string COMPANY_COUNTRY_NAME { get; set; }
        public string COMPANY_CITY_NAME { get; set; }
        public string COMPANY_DISTRICT_NAME { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string BUSINESS_ACCOUNT_ID { get; set; }
        public string COMPANY_CODE { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }
        public string COMPANY_NAME_CHINESE { get; set; }
        public string COMPANY_LOGO_NAME { get; set; }
        public string COMPANY_LOGO_PATH { get; set; }
        public string COMPANY_BANNER_NAME { get; set; }
        public string COMPANY_BANNER_PATH { get; set; }
        public string COMPANY_PHONE { get; set; }
        public string COMPANY_ADDRESS { get; set; }
        public string FACEBOOK_URL { get; set; }
        public string INSTAGRAM_URL { get; set; }
        public string WECHAT_URL { get; set; }
        public string TWITTER_URL { get; set; }
        public string PAGE_URL { get; set; }
        public string COMPANY_DESCRIPTION { get; set; }
        public string COMPANY_SERVICE { get; set; }
        public string TAGS { get; set; }
        public string IS_SEARCHABLE_IN_MARKETPLACE { get; set; }
        public string COMPANY_EMAIL { get; set; }
        public string COUNTRY_ID { get; set; }
        public string CITY_ID { get; set; }
        public string DISTRICT_ID { get; set; }
        public string TOTAL_WEBSITE_VISITS { get; set; }
        public string IS_DEFAULT { get; set; }
        public string IS_ACTIVE { get; set; }
        public List<string> CATEGORIES { get; set; }
        public List<string> SUB_CATEGORIES { get; set; }
    }

    public class TagsObject
    {
        public string value { get; set; }
    }


    public class Tag
    {
        public string TAG { get; set; }
    }

    public class CALENDAR_SUB_CATEGORY
    {
        public int Id { get; set; }
        public string CALENDAR_SUB_CATEGORY_NAME { get; set; }
    }

    public class CALENDAR_CATEGORY
    {
        public int Id { get; set; }
        public string CALENDAR_CATEGORY_NAME { get; set; }
    }

    public class CopmanyServiceDescription
    {       
        public string COMPANY_SERVICE { get; set; }
    }
}
