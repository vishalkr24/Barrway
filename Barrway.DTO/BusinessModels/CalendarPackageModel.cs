using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CalendarPackageModel
    {
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public string PACKAGE_NAME { get; set; }
        public double PACKAGE_PRICE { get; set; }
        public double PACKAGE_COIN { get; set; }
        public double PACKAGE_SEQUENCE { get; set; }
        public string PACKAGE_DESCRIPTION { get; set; }
        public string IS_ACTIVE { get; set; }
    }
}
