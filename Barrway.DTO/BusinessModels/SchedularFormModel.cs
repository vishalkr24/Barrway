using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class SchedularFormModel
    {
        public string Id { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string SCH__NAME { get; set; }
        public string SCH_LOCATION { get; set; }
        public string SCH_ACTIVITY { get; set; }
        public string SCH_RESOURCE { get; set; }
        public string SCH_MEDIUM { get; set; }
        public string SCH_DESCRIPTION { get; set; }
        public string SCH_FROM_DATE { get; set; }
        public string DURATION_FIELD { get; set; }
        public string REST_PERIOD_BETWEEN_SESSION { get; set; }
        public string MAXIMUM_NO_OF_PARTICIPANTS { get; set; }
        public string SCH_TO_DATE { get; set; }
        public string SCH_DAYS { get; set; }
        public string IF_SLOT_EXIST { get; set; }
        public string IF_SLOT_DOES_NOT_EXIST { get; set; }
        public string SCH_ALTERNATIVE_WEEK { get; set; }
        public SCHSCHEDULETABLE table { get; set; }
        public string SCH_SCHEDULE_TABLE { get; set; }
        public string CREATION_TYPE { get; set; }
        public string SCHEDULAR_TYPE { get; set; }
        public string DOWNLOADABLE_ATTACHMENT { get; set; }
        public string DOWNLOAD_FILE_LIST { get; set; }
        public string IS_UPLOAD_REQUIRED { get; set; }
        public string UPLOAD_TIME { get; set; }
    }

    public class CommonTimeObject
    {
        public string Id { get; set; }
        public string start { get; set; }
        public string end { get; set; }
        public string IsOverlapped { get; set; } = "false";
    }

    public class SCHSCHEDULETABLE
    {
        public List<CommonTimeObject> Mon { get; set; }
        public List<CommonTimeObject> Tue { get; set; }
        public List<CommonTimeObject> Wed { get; set; }
        public List<CommonTimeObject> Thu { get; set; }
        public List<CommonTimeObject> Fri { get; set; }
        public List<CommonTimeObject> Sat { get; set; }
        public List<CommonTimeObject> Sun { get; set; }
    }

}
