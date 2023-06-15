using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.MarketplaceModels
{
    public class RequestEventViewModel
    {
        public string start { get; set; }
        public string end { get; set; }
        public string companyCode { get; set; }
        public string calendarCode { get; set; }
        public int resourceFormId { get; set; }
        public string resourceTitle { get; set; }
        public int resourceId { get; set; }
        public int activityId { get; set; }
        public int activityFormId { get; set; }
        public string activityTitle { get; set; }
        public int otherActivityformId { get; set; }
        public int otherActivityId { get; set; }
    }
}
