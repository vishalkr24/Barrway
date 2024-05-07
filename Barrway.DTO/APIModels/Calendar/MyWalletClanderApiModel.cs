using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Calendar
{
    public class MyWalletClanderApiModel
    {
        public int page { get; set; }
        public int size { get; set; }
        public int last_page { get; set; }
        public int page_records { get; set; }
        public string COMPANY_CODE { get; set; }
    }

    


    public class MyWalletCalander
    {
        public int total_records { get; set; }
        public int size { get; set; }
        public int page { get; set; }
        public int COIN_BALANCE { get; set; }
        public object PackageInfo { get; set; }
        public int CompanyId { get; set; }
        public int Id { get; set; }
        public string formGroupKey { get; set; }
        public int formID { get; set; }
        public int userID { get; set; }
        public string Current_Status { get; set; }
        public int cycle { get; set; }
        public int MasterFormID { get; set; }
        public string MasterFormRow { get; set; }
        public int formRecordOrder { get; set; }
        public int formRecordStatus { get; set; }
        public object ApprovalStatus { get; set; }
        public object text_1682340663322 { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public object created_by { get; set; }
        public object updated_by { get; set; }
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
        public int? PRIORITY { get; set; }
        public string IS_FEATURED { get; set; }
        public int? SEQUENCE { get; set; }
        public string STATUS { get; set; }
        public object select_1712301157894 { get; set; }
        public object select_1712301162534 { get; set; }
        public object select_1712301164412 { get; set; }
        public object select_1712301179848 { get; set; }
        public string INTERVAL_TIME { get; set; }
        public object DEFAULT_DISPLAY_DATE { get; set; }
        public string DEFAULT_DATE { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }
        public string COMPANY_LOGO_PATH { get; set; }
        public string CALENDAR_SUB_CATEGORY_NAME { get; set; }
        public string ServiceList { get; set; }
    }


    public class MyWalletCompany
    {
        public int Id { get; set; }
        public string COMPANY_CODE { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }
        public string COMPANY_NAME_CHINESE { get; set; }
        
    }



}
