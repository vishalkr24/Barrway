using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CompanySubscriptionDetailsModel
    {

        public string Id { get; set; }

        public double CALENDAR_AVAILABLE { get; set; }
        public double CLIENT_PACKAGE_AVAILABLE { get; set; }
        public double BOOKING_TRANSACTIONS { get; set; }
        public double NO_OF_ADMIN { get; set; }
        public string PHOTO_ALBUM { get; set; }
        public string CLIENT_PAYMENT { get; set; }
        public string PROMOTION_IN_MARKETPLACE { get; set; }
        public string CHAT_WITH_CLIENT { get; set; }
        public DateTime PURCHASE_DATE { get; set; }

        public string PAYMENT_ID { get; set; }

        public string ORDER_ID { get; set; }
        public string PAYMENT_METHOD { get; set; }
        public string PAYMENT_STATUS { get; set; }
        public string IS_ACTIVE { get; set; }
        public string IS_FREE_PLAN { get; set; }
        public string PLAN_ID { get; set; }
        public string COMPANY_ID { get; set; }

    }
}
