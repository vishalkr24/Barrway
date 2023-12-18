using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CompanyPackageModel
    {
        public string COMPANY_CODE { get; set; }
        public string PACKAGE_NAME { get; set; }
        public double PACKAGE_PRICE { get; set; }
        public string PACKAGE_DESCRIPTION { get; set; }
        public int TOTAL_CALENDARS { get; set; }
        public int SESSIONS_PER_CALENDAR { get; set; }
        public int BOOKING_PER_SESSION { get; set; }
        public string IS_ACTIVE { get; set; }
    }
}
