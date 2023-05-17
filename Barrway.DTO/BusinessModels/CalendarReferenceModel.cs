using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class CalendarReferenceModel
    {
        public string Id { get; set; }
        public string formId { get; set; }
        public string formgroupkey { get; set; }
        public string currentFormType { get; set; } = "0";
        public string referrenceFormId { get; set; }
        public string referrenceId { get; set; }
        public string referrenceFormTable { get; set; }
        public string referrenceColumnName { get; set; }
        public string resourceFormId { get; set; }
        public string resourceId { get; set; }

    }
}
