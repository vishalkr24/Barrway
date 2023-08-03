using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class Friday
    {
        public string Start { get; set; }
        public string End { get; set; }
    }

    public class Monday
    {
        public string Start { get; set; }
        public string End { get; set; }
    }

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
        public string SCH_TO_DATE { get; set; }
        public string SCH_DAYS { get; set; }
        public string IF_SLOT_EXIST { get; set; }
        public string IF_SLOT_DOES_NOT_EXIST { get; set; }
        public string SCH_ALTERNATIVE_WEEK { get; set; }
        public SCHSCHEDULETABLE table { get; set; }
        public string SCH_SCHEDULE_TABLE { get; set; }
        public string CREATION_TYPE { get; set; }
    }

    public class Saturday
    {
        public string Start { get; set; }
        public string End { get; set; }
    }

    public class SCHSCHEDULETABLE
    {
        public Monday Monday { get; set; }
        public Tuesday Tuesday { get; set; }
        public Wednesday Wednesday { get; set; }
        public Thursday Thursday { get; set; }
        public Friday Friday { get; set; }
        public Saturday Saturday { get; set; }
        public Sunday Sunday { get; set; }
    }

    public class Sunday
    {
        public string Start { get; set; }
        public string End { get; set; }
    }

    public class Thursday
    {
        public string Start { get; set; }
        public string End { get; set; }
    }

    public class Tuesday
    {
        public string Start { get; set; }
        public string End { get; set; }
    }

    public class Wednesday
    {
        public string Start { get; set; }
        public string End { get; set; }
    }
}
