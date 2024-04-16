using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.BusinessModels
{
    public class OrderDetailsViewModel
    {
        public OrderModel Order { get; set; }
        public CalendarPackageModel CalendarPackageModel { get; set; }
        public string start { get; set; }
        public string end { get; set; }
    }
}
