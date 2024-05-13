using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.SearchAPI
{
    public class FavouriteCalendar
    {
        public int total_records { get; set; }
        public int size { get; set; }
        public int page { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public int Id { get; set; }
        public DateTime created_at { get; set; }
        public int CompanyId { get; set; }
        public string CALENDAR_NAME { get; set; }
        public string CALENDAR_PHOTO_NAME { get; set; }
        public string CALENDAR_PHOTO_PATH { get; set; }
        public string CALENDAR_CATEGORY_ID { get; set; }
        public string CALENDAR_SUB_CATEGORY_ID { get; set; }
        public string TAGS { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }
        public string COMPANY_LOGO_PATH { get; set; }
        public string CALENDAR_SUB_CATEGORY_NAME { get; set; }
        public double COIN_BALANCE { get; set; }
        public string PURCHASED { get; set; }
    }



    public class FavouriteCalendarDetails
    {
        public int Id { get; set; }
        public string CALENDAR_NAME { get; set; }
        public string CALENDAR_PHOTO_NAME { get; set; }
        public string CALENDAR_PHOTO_PATH { get; set; }
        public string IS_VISIBLE { get; set; }
        public string COUNTRY_ID { get; set; }
        public string CITY_ID { get; set; }
        public string DISTRICT_ID { get; set; }
        public string CALENDAR_CATEGORY_ID { get; set; }
        public string CALENDAR_SUB_CATEGORY_ID { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string TAGS { get; set; }
        public string SLOT_DURATION_IN_MINS { get; set; }
        public object CAL_CURRENT_STEP { get; set; }
        public string CALENDAR_TYPE { get; set; }
        public string CALENDAR_FUNCTION_TYPE { get; set; }
        public string CALENDAR_USE_TYPE { get; set; }
        public string DISPLAY_MIN_TIME { get; set; }
        public string DISPLAY_MAX_TIME { get; set; }
        public string DEFAULT_RESOURCE { get; set; }
        public string ADDITIONAL_FORM_ID { get; set; }
        public string NEED_ADDITIONAL_FORM { get; set; }
        public string DEFAULT_CALENDAR_VIEW { get; set; }
        public string REQUIRED_CALENDAR_VIEWS { get; set; }
        public string CALENDAR_COMMON_CATEGORY_ID { get; set; }
        public string IS_VISIBLE_ON_MARKETPLACE_HOME { get; set; }
        public int PRIORITY { get; set; }
        public string IS_FEATURED { get; set; }
        public int SEQUENCE { get; set; }
        public string STATUS { get; set; }
        public string INTERVAL_TIME { get; set; }
        public object DEFAULT_DISPLAY_DATE { get; set; }
        public string DEFAULT_DATE { get; set; }
        public object SERVICE_CHARGE_BY { get; set; }
        public string IsFavourite { get; set; }
        public string ALLOW_OVERLAP { get; set; }
    }





    public class FavouriteClanderData
    {

        public int page { get; set; } 
        public int size { get; set; } 
        public int last_page { get; set; }
        public int page_records { get; set; }      
        public string CalendarCode { get; set; }
        public string COMPANY_CODE { get; set; }

    }

    public class MyFavouriteCompany
    {
        public int Id { get; set; }
        public string COMPANY_CODE { get; set; }
        public string COMPANY_NAME { get; set; }
        

    }



    public class Filter
    {
        public string field { get; set; }
        public string type { get; set; }
        public string value { get; set; }
    }
    public class Sort
    {
        public string field { get; set; }
        public string dir { get; set; }
    }
}
