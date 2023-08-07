using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.MarketplaceModels
{
    public class SearchResultModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public List<IDictionary<string, string>> OtherIds { get; set; }
        public int ResultType { get; set; }
    }
}
