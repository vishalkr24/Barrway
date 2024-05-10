using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.MarketplaceModels
{
    public class SearchResultsModel
    {
        public List<Company> CompanyLIst { get; set; }       
        public List<CompanyService> ServiceList { get; set; }
        public List<blog> BlogLIst { get; set; }
        public string keyword { get; set; }
    }

    public class CompanyService
    {
        public int Id { get; set; }
        public string CALENDAR_NAME { get; set; }
        public string CALENDAR_PHOTO_NAME { get; set; }
        public string CALENDAR_PHOTO_PATH { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string TAGS { get; set; }
        public List<TagsObject> TAGs { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }

    }


    public class Company
    {
        //public string Id { get; set; }
        //public string CompanyName { get; set; }
        //public string CompanyCode { get; set; }
        //public string CalendarName { get; set; }
        //public string CalendarCode { get; set; }
        //public string Description { get; set; }
        //public string ImagePath { get; set; }
        //public string Tags { get; set; }
        //public int ResultType { get; set; }
        //public string RedirectUrl { get; set; }

        public int Id { get; set; }
       
        
        public object BUSINESS_ACCOUNT_ID { get; set; }
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
        public List<TagsObject> TAGs { get; set; }
        public string IS_SEARCHABLE_IN_MARKETPLACE { get; set; }
        public string COMPANY_CATEGORY_ID { get; set; }
        public string COMPANY_SUB_CATEGORY_ID { get; set; }
        public string COUNTRY_ID { get; set; }
        public string CITY_ID { get; set; }
        public string DISTRICT_ID { get; set; }       
        public string textarea_1705645292908 { get; set; }
        public string TEMPLATE_ID { get; set; }
        public string PALETTE_ID { get; set; }
        public string IS_FEATURED { get; set; }
        public string IS_ACTIVE { get; set; }



    }
    public class blog
    {
        public int Id { get; set; }
        public string BLOG_TITLE { get; set; }
        public string IMAGE { get; set; }
        public string TAG { get; set; }
        public List<TagsObject> TAGs { get; set; }
        public string BLOG_CATEGORY { get; set; }
        
    }

    

}
