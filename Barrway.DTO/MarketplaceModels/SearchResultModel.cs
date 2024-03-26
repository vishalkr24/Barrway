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
        public string CompanyName { get; set; }
        public string CompanyCode { get; set; }
        public string CalendarName { get; set; }
        public string CalendarCode { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public string Tags { get; set; }
        public int ResultType { get; set; }
        public string RedirectUrl { get; set; }
    }
}
