using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class SessionReviewModel
    {
        public string TRANSACTION_ID { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public double REVIEW_SCORE { get; set; }
        public string REVIEW_COMMENT { get; set; }
    }
}
