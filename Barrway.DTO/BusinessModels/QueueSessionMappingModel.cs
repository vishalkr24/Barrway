using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class QueueSessionMappingModel
    {
        public string Id { get; set; }
        public string SESSION_ID { get; set; }
        public string QUEUE_ID { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string SCHEDULE_ID { get; set; }
        public DateTime LAST_UPDATED { get; set; } = DateTime.Now;
    }
}
