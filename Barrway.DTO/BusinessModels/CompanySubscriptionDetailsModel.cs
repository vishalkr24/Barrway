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
        public string ORDER_ID { get; set; }
        public string IS_ACTIVE { get; set; }
        public string IS_FREE_PLAN { get; set; }
        public string PLAN_ID { get; set; }
        public string COMPANY_ID { get; set; }
    }
}
