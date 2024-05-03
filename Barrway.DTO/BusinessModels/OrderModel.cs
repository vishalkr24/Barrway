using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class OrderModel
    {
        public string CALENDAR_CODE { get; set; }
        public string ORDER_NO { get; set; }
        public string ORDER_TYPE { get; set; }
        public string USER_ID { get; set; }
        public string PACKAGE_ID { get; set; }
        public string SLOT_ID { get; set; }
        public double ORDER_PRICE { get; set; }
        public double ORDER_COIN { get; set; }
        public string PAYMENT_ID { get; set; }
        public string PAYMENT_STATUS { get; set; }
        public string PAYMENT_TYPE { get; set; } = "STRIPE";
        public double ORDER_QTY { get; set; }
        public string SERVICE_ID { get; set; }
        public DateTime PAYMENT_DATE { get; set; }
    }
}
