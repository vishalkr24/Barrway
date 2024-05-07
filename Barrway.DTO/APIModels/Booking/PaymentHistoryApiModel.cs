using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Booking
{
    public class PaymentHistoryApiModel
    {
        public long total_records { get; set; }
        public int size { get; set; }
        public int page { get; set; }
        public string PLAN_ID { get; set; }
        public int? PLAN_ID_Id { get; set; }
        public int id { get; set; }
        public int formrecordorder { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string PAYMENT_ID { get; set; }
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public int B_COIN_PURCHASE { get; set; }
        public DateTime PAID_DATE { get; set; }
        public string METHOD { get; set; }
        public int CLIENT_PAID_HKD { get; set; }
        public string STATUS { get; set; }
        public string USER_ID { get; set; }
        public string CREDIT_EXPIRE_DATE { get; set; }
    }

    public class PaymentHistorySearchApiModel
    {
        public int page { get; set; }
        public int size { get; set; }
        public int last_page { get; set; }
        public int page_records { get; set; }
    }
}
