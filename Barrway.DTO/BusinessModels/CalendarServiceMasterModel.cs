using Barrway.DTO.CustomValidations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Barrway.DTO.BusinessModels
{
    public class CalendarServiceMasterModel
    {
        public string Id { get; set; }
        public string ACTIVITY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public string ACTIVITY_NAME { get; set; }
        public string SERVICE_TYPE { get; set; }
        public string PHOTO { get; set; }
        public string CATEGORY { get; set; }
        public string SUB_CATEGORY { get; set; }
        public string START_DATETIME { get; set; }
        public string END_DATETIME { get; set; }
        public string REQUIRED_TOKENS { get; set; }
        public string MAXIMUM_NO_OF_PARTICIPANTS { get; set; }
        public string MINIMUM_NO_OF_PARTICIPANTS { get; set; }
        public string ACTIVITY_LEVEL { get; set; }
        public string ACTIVITY_PRE_REQUISITE { get; set; }


        public string ON_WAITING_LIST_NO { get; set; }
        public string CANCELLATION_FEE { get; set; }
        public string MAXIMUM_DURATION { get; set; }
        public string MINIMUM_DURATION { get; set; }
        public string NEED_ONLINE_PAYMENT { get; set; } = "Y";
        public string SEARCHABLE { get; set; } = "Y";
        public string DESCRIPTION { get; set; }


        public string TAG { get; set; }
        public string DURATION_FIELD { get; set; }
        public string COLOR { get; set; }
        public string PUBLIC_INFORMATION { get; set; }
        public string fees_1 { get; set; }
        public string IS_SERVICE_PAID { get; set; }
    }
}
