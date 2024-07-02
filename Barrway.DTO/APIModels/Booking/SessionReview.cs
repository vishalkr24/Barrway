using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Booking
{
    
    public class SessionReview
    {
        public string EVENT_ID { get; set; }
        public string USER_ID { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public double REVIEW_SCORE { get; set; }
        public string REVIEW_COMMENT { get; set; }
    }


    public class Session_ReviewViewModel
    {
        public string EVENT_ID { get; set; }       
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public double REVIEW_SCORE { get; set; }
        public string REVIEW_COMMENT { get; set; }
    }




    public class SessionReviewViewModel
    {
        public string EVENT_ID { get; set; }
        public string USER_EMAIL { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public double REVIEW_SCORE { get; set; }
        public string REVIEW_COMMENT { get; set; }
        public string SERVICE_NAME { get; set; }
        public string LOCATION_NAME { get; set; }
        public string SERVICE_PROVIDER_NAME { get; set; }
        public DateTime FROM_TIME { get; set; }
        public DateTime TO_TIME { get; set; }
        public bool SESSION_REVIEWED { get; set; }
    }

}
