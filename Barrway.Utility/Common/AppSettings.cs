using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Utility.Common
{
    public class AppSettings
    {
        public static string title = "GeliGulu";
        public static string telephone = "1234567890";
        public static string fax = "1234567890";
        public static string email = "info@geligulu.com";
        public static string dateformat = "dd/MM/yyyy";
        public static string datetimeformat = "yyyy-MM-dd HH:mm:ss";
        public static int token_expire_time = 24 * 60;
        public static string app_name = "Barrway";
        public static string[] exclude_columns = new string[] { "Id", "formGroupKey", "formID", "userID", "Current_Status", "cycle", "MasterFormID", "MasterFormRow", "formRecordOrder", "formRecordStatus", "ApprovalStatus", "created_at", "updated_at", "created_by", "updated_by" };
        public static string[] exclude_columns_but_id = new string[] { "formGroupKey", "formID", "userID", "Current_Status", "cycle", "MasterFormID", "MasterFormRow", "formRecordOrder", "formRecordStatus", "ApprovalStatus", "created_at", "updated_at", "created_by", "updated_by" };
    }


}
