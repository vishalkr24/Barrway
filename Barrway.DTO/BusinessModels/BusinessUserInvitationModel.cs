using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class BusinessUserInvitationModel
    {
        public string Id { get; set; }
        public string COMPANY_ID { get; set; }
        public string INVITED_EMAIL { get; set; }
        public string SENT_BY { get; set; }
        public string REQUEST_TOKEN { get; set; }
        public string STATUS { get; set; } = "Pending";
    }
}
