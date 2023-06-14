using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class BulkAttendanceModel
    {
        public string Id { get; set; }
        public string Attendance { get; set; }
        public bool IsUpdated { get; set; }
        public string CompanyCode { get; set; }
    }


}
