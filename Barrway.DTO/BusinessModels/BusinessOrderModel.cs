using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class BusinessOrderModel
    {
        public string ORDER_NO { get; set; }
        public string USER_ID { get; set; }
        public string PACKAGE_ID { get; set; }
        public string PLAN_NAME { get; set; }
        public string PLAN_DESCRIPTION { get; set; }
        public string CALENDAR_AVAILABLE { get; set; }
        public string SESSION_MONTH_COMPANY { get; set; }
        public string BOOKING_SESSION_COMPANY { get; set; }
        public string COMPANY_ID { get; set; }
        public DateTime VALID_TILL { get; set; }
        public int VALIDITY_DAYS { get; set; }
        public string IS_MONTHLY { get; set; }
        public double ORDER_PRICE { get; set; }
        public string PAYMENT_ID { get; set; }
        public string PAYMENT_STATUS { get; set; }
        public string PAYMENT_TYPE { get; set; } = "STRIPE";
        public double ORDER_QTY { get; set; }
        public DateTime PAYMENT_DATE { get; set; }
    }
}
