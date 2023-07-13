using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class PaymentReceiptViewModel
    {
        public string ActivityName { get; set; }
        public string ClientName { get; set; }
        public string ServiceProviderName { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentStatus { get; set; }
        public string PackageName { get; set; }
        public double Quantity { get; set; }
        public double Amount { get; set; }
        public string OrderNo { get; set; }
        public string TransactionType { get; set; }
        public double CoinsAdded { get; set; }
        public double CoinsDeducted { get; set; }
    }
}
