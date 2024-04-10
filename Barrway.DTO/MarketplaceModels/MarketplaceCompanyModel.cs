using Barrway.DTO.BusinessModels;
using FormGeneratorDTOs.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.MarketplaceModels
{
    public class MarketplaceCompanyModel
    {
        public string Id { get; set; }
        public string TEMPLATE_ID { get; set; }
        public string PALETTE_ID { get; set; }

        public string COMPANY_CODE { get; set; } = String.Empty;
        public string COMPANY_LOGO_NAME { get; set; } = String.Empty;
        public string COMPANY_LOGO_PATH { get; set; } = String.Empty;
        public string COMPANY_BANNER_NAME { get; set; } = String.Empty;
        public string COMPANY_BANNER_PATH { get; set; } = String.Empty;
        public string COMPANY_NAME_ENGLISH { get; set; } = String.Empty;
        public string COMPANY_NAME_CHINESE { get; set; } = String.Empty;
        public string COMPANY_PHONE { get; set; } = String.Empty;
        public string COMPANY_EMAIL { get; set; } = String.Empty;
        public string COMPANY_ADDRESS { get; set; } = String.Empty;
        public string WECHAT_URL { get; set; } = String.Empty;
        public string IS_DEFAULT { get; set; } = String.Empty;
        public string FACEBOOK_URL { get; set; } = String.Empty;
        public string TWITTER_URL { get; set; } = String.Empty;
        public string INSTAGRAM_URL { get; set; } = String.Empty;
        public string PAGE_URL { get; set; } = String.Empty;
        public string Latitude { get; set; } = String.Empty;
        public string Longitude { get; set; } = String.Empty;
        public string TAGS { get; set; } = String.Empty;
        public List<TagsObject> TAGs { get; set; }
        public string IS_SEARCHABLE_IN_MARKETPLACE { get; set; } = String.Empty;
        public string COMPANY_SERVICE { get; set; } = String.Empty;
        public string COMPANY_DESCRIPTION { get; set; } = String.Empty;
        public float TOTAL_WEBSITE_VISITS { get; set; } = 0;
        public string COMPANY_CATEGORY_ID { get; set; } = String.Empty;
        public string COMPANY_SUB_CATEGORY_ID { get; set; } = String.Empty;
        public string COUNTRY_ID { get; set; } = String.Empty;
        public string CITY_ID { get; set; } = String.Empty;
        public string DISTRICT_ID { get; set; } = String.Empty;
        public string IS_ACTIVE { get; set; } = String.Empty;
        public string IS_TEMPLATE { get; set; } = String.Empty;
        public string COMPANY_CATEGORY_NAME { get; set; } = String.Empty;
        public string COMPANY_SUB_CATEGORY_NAME { get; set; } = String.Empty;
        public string COMPANY_CITY_NAME { get; set; } = String.Empty;
        public string COMPANY_COUNTRY_NAME { get; set; } = String.Empty;
        public string COMPANY_DISTRICT_NAME { get; set; } = String.Empty;
       

        public List<BusinessCalendarModel> calendars { get; set; }
        public List<ServicesList> ServicesList { get; set; }
        public string DEFAULT_CALENDAR_ID { get; set; }
        public List<BusinessCompanyCategoryModel> services { get; set; }

    }

}
