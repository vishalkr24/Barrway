using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class LedgerModel
    {
        public string ORDER_NO { get; set; }
        public double DEBIT_COIN { get; set; }
        public double CREDIT_COIN { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public string USER_ID { get; set; }
    }
}
