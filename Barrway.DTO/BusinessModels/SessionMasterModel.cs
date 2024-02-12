using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class SessionMasterModel
    {
        public string Id { get; set; }
        public string QUEUE_ID { get; set; }
        public string SESSION_NAME { get; set; }
        public string QUEUE_OPEN_TIME { get; set; }
        public string SESSION_START_TIME { get; set; }
        public string SESSION_END_TIME { get; set; }
        public string TICKETING_TYPE { get; set; }
    }
}
