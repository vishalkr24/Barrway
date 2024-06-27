using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class IndividualEventModel
    {
        public string Id { get; set; }
        public string SCH_ACTIVITY { get; set; }
        public string SCH_RESOURCE { get; set; }
        public string SCH_LOCATION { get; set; }
        public DateTime SCH_FROM_DATE { get; set; }
        public DateTime SCH_TO_DATE { get; set; }
        public string SCH_DESCRIPTION { get; set; }
    }
}
