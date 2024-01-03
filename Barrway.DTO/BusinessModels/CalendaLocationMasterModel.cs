using Barrway.DTO.CustomValidations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Barrway.DTO.BusinessModels
{
    public class CalendarLocationMasterModel
    {
        public string Id { get; set; }
        public string LOCATION_CODE { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }
        public string LOCATION_ADDRESS { get; set; }
        public string LOCATION_BUILDING_NAME { get; set; }
    }
}
