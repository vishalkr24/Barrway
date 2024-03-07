using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CalendarFormModel
    {
        public string Id { get; set; }
        public string title { get; set; }
        public string start { get; set; }
        public string end { get; set; }
        public string allDay { get; set; }
        public string resources { get; set; }
        public string activities { get; set; }
        public string description { get; set; }
        public string color { get; set; }
        public string CALENDAR_CODE { get; set; }
        public string COMPANY_CODE { get; set; }

    }
}
