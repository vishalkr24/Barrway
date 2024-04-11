using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class PaymentHistoryModel
    {
        public int Id { get; set; }
        public string PAYMENT_ID { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string PLAN_ID { get; set; }
        public double B_COIN_PURCHASE { get; set; }
        public DateTime PAID_DATE { get; set; }
        public string METHOD { get; set; }
        public double CLIENT_PAID_HKD { get; set; }
        public string STATUS { get; set; }
        public DateTime CREDIT_EXPIRE_DATE { get; set; }
        public string USER_ID { get; set; }
    }
}
