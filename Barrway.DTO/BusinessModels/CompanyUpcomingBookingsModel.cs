using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CompanyUpcomingBookingsModel
    {
        public string COMPANY_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public DateTime BOOKING_DATE { get; set; }
        public string SERVICE_NAME { get; set; }
        public string SERVICE_PROVIDER { get; set; }
        public string CLIENT_NAME { get; set; }
        public DateTime FROM_TIME { get; set; }
        public DateTime TO_TIME { get; set; }
    }
}
