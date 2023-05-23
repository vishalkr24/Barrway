using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CalendarControlModel
    {
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string USER_ADMIN_GROUP_NAME { get; set; }
        public string CALENDAR_USE_TYPE { get; set; }
        public string THEME_SELECTION { get; set; }
        public string RESOURCE_FORM_YN { get; set; }
        public string RESOURCE_NAME { get; set; }
        public string RESOURCE_FORM_CATEGORY { get; set; }
        public string CALENDAR_GROUP_NAME { get; set; }
        public string RESOURCE_FORM_NAME { get; set; }
        public string RESOURCE_ALLOW_OVERLAP_YN { get; set; }
        public string HAS_ACTIVITIES_YN { get; set; }
        public string ACTIVITY_NAME { get; set; }
        public string ACTIVITY_FORM_CATEGORY { get; set; }
        public string ACTIVITY_FORM_NAME { get; set; }
        public string ACTIVITY_ALLOW_OVERLAP_YN { get; set; }
        public string LOCATION_NAME { get; set; }
        public string LOCATION_FORM_CATEGORY { get; set; }
        public string LOCATION_FORM_NAME { get; set; }
        public string LOCATION_ALLOW_OVERLAP_YN { get; set; }
        public string HAS_PARTICIPANT_FORM_YN { get; set; }
        public string PARTICIPANT_NAME { get; set; }
        public string PARTICIPANT_FORM_CATEGORY { get; set; }
        public string PARTICIPANT_FORM_NAME { get; set; }
        public string PARTICIPANT_ALLOW_REPEAT_YN { get; set; }
        public string REQUIRE_REGISTRATION_YN { get; set; }
        public string HAS_EVALUATION_YN { get; set; }
        public string EVALUATION_NAME { get; set; }
        public string EVALUATION_FORM_CATEGORY { get; set; }
        public string EVALUATION_FORM_NAME { get; set; }
        public string HAS_ASSESSMENT_YN { get; set; }
        public string ASSESSMENT_NAME { get; set; }
        public string ASSESSMENT_FORM_CATEGORY { get; set; }
        public string ASSESSMENT_FORM_NAME { get; set; }
    }
}
