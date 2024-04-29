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
        public bool IS_TEMPLATE { get; set; }
        public int TEMPLATE_ID { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int PALETTE_ID { get; set; }
        public string COMPANY_COUNTRY_NAME { get; set; }
        public string COMPANY_CITY_NAME { get; set; }
        public string COMPANY_DISTRICT_NAME { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public int BUSINESS_ACCOUNT_ID { get; set; }
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
        public bool IS_SEARCHABLE_IN_MARKETPLACE { get; set; }
        public int COMPANY_CATEGORY_ID { get; set; }
        public int COMPANY_SUB_CATEGORY_ID { get; set; }
        public string COMPANY_EMAIL { get; set; }
        public int COUNTRY_ID { get; set; }
        public int CITY_ID { get; set; }
        public int DISTRICT_ID { get; set; }
        public int TOTAL_WEBSITE_VISITS { get; set; }
        public bool IS_DEFAULT { get; set; }
        public bool IS_ACTIVE { get; set; }

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
}
