using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.SearchAPI
{
    public class SearchAPIModel
    {
        public List<int> districtIds { get; set; }
        public List<int> subcatIds { get; set; }
        public List<string> tags { get; set; }
        public string CALENDAR_NAME { get; set; }
        public int CategoryId { get; set; }
        public int size { get; set; }
        public int page { get; set; }
    }
}
