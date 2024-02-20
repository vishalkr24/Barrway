using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class QueueMasterModel
    {
        public string Id { get; set; }
        public string QUEUE_BY { get; set; }
        public string QUEUE_RESOURCE_ID { get; set; }
        public string QUEUE_NAME { get; set; }
        public string QUEUE_USAGE { get; set; } = "TICKET";
        public string QUEUE_PREFIX { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public string ACCEPT_TICKET { get; set; } = "Y";
        public string QUEUE_START_NUMBER { get; set; }
        public string QUEUE_END_NUMBER { get; set; }
        public string QUEUE_RESET_NUMBER { get; set; }
    }
}
