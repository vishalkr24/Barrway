using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class TicketMasterModel
    {
        public string Id { get; set; }
        public string QUEUE_ID { get; set; }
        public string SESSION_ID { get; set; }
        public string USER_ID { get; set; }
        public string STATUS { get; set; }
        public string TICKET_NUMBER { get; set; }
        public int POSITION { get; set; }
        public string IsApproved { get; set; } = "N";
    }
}
