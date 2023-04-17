using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.FormAPI
{
    public class GetFormRecordListResponseModel
    {
        public double last_page { get; set; }
        public List<IDictionary<string, object>> data { get; set; }
    }
}
