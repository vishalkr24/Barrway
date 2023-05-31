using Barrway.DTO.PublicModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.UserAdminModels
{
    public class CalendarEnrollModel
    {
        public string USER_ID { get; set; }
        public CalendarParticipantModel participant { get; set; }
        public TransactionMasterModel transaction { get; set; }
    }
}
