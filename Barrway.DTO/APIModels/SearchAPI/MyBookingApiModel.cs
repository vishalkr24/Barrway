using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.SearchAPI
{
    public class MyBookingApiModel
    {
        public string keyword { get; set; }
        public int size { get; set; }
        public int page { get; set; }
    }
}
