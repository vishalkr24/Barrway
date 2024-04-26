using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.SearchAPI
{
    public class Bussiness_company
    {
        public List<int> districtIds { get; set; } = null;
        public List<int> CityIds { get; set; } = null;
        public List<int> CountryIds { get; set; } = null;
        public List<string> tags { get; set; } = null;
        public string CompanyName { get; set; } = "";
        public int size { get; set; }
        public int page { get; set; }
    }
}
