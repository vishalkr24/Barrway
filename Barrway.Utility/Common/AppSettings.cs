using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Utility.Common
{
    public class AppSettings
    {
        public static string default_company_logopath = "http://20.204.74.222:85/assets/marketplace/image/alogo2.png";
        public static string default_company_bannerpath = "http://20.204.74.222:85/assets/marketplace/image/banner-back.jpg";
        public static string default_calernar_path = "http://20.204.74.222:85/assets/marketplace/image/pro.png";
        public static string title = "Barrway Business";
        public static string telephone = "";
        public static string fax = "";
        public static string email = "info@barrway.com";
        public static string dateformat = "dd/MM/yyyy";
        public static string datetimeformat = "yyyy-MM-dd HH:mm:ss";
        public static int token_expire_time = 24 * 60;
        public static string app_name = "Barrway Business";
        public static string[] exclude_columns = new string[] { "Id", "formGroupKey", "formID", "userID", "Current_Status", "cycle", "MasterFormID", "MasterFormRow", "formRecordOrder", "formRecordStatus", "ApprovalStatus", "created_at", "updated_at", "created_by", "updated_by" };
        public static string[] exclude_columns_but_id = new string[] { "formGroupKey", "formID", "userID", "Current_Status", "cycle", "MasterFormID", "MasterFormRow", "formRecordOrder", "formRecordStatus", "ApprovalStatus", "created_at", "updated_at", "created_by", "updated_by" };
    }


}
