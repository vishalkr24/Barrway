using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.SearchAPI
{
    public class CompanySearchApiModel
    {
        public List<int> districtIds { get; set; }
        //public List<int> CityIds { get; set; } = null;
        //public List<int> CountryIds { get; set; } = null;
        public List<string> tags { get; set; } 
        public string keyword { get; set; } 
        public int size { get; set; }
        public int page { get; set; }
    }
}
