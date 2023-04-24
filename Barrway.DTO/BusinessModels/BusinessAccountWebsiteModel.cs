using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class BusinessAccountWebsiteModel
    {
        public string SUBSCRIPTION_PLAN_ID { get; set; }
        public string USER_ID { get; set; }
        public string CURRENT_STEP { get; set; }

        public string COMPANY_PROFILE_STATUS { get; set; }
        public string COMPANY_CALENDAR_STATUS { get; set; }

    }
}
