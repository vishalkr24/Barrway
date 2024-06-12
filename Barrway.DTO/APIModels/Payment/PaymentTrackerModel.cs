using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Payment
{
    public class PaymentTrackerModel
    {
        public string Id { get; set; }
        public string ORDER_NO { get; set; }
        public string PAYMENT_REQUEST_JSON { get; set; }
        public Nullable<DateTime> REQUEST_TIME { get; set; }
        public string PAYMENT_RESPONSE_JSON { get; set; }
        public Nullable<DateTime> RESPONSE_TIME { get; set; }
    }
}
