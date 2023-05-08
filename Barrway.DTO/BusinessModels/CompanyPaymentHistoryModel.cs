using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CompanyPaymentHistoryModel
    {

        public string Id { get; set; }
        public string ORDER_ID { get; set; }

        public string PAYMENT_ID { get; set; }
        public string PLAN_ID { get; set; }

        public string PAYMENT_DESCRIPTION { get; set; }
        public string PAYMENT_METHOD { get; set; }

        public double HKD { get; set; }
        public DateTime PAYMENT_DATE { get; set; }

        public string PAYMENT_STATUS { get; set; }
        public string COMPANY_ID { get; set; }

    }
}
