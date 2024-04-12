using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.MarketplaceModels
{
    public class FeaturedCompanyList
    {
        public List<FeaturedCompany> FeaturedCompanys { get; set; }

    }

    public class FeaturedCompany
    {
        public int Id { get; set; }
        public string COMPANY_NAME { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }
        public string COMPANY_BANNER_PATH { get; set; }
        public string COMPANY_LOGO_PATH { get; set; }
        public string COMPANY_BANNER_NAME { get; set; }
        public string TAGS { get; set; }
        public List<TagsObject> TAGs { get; set; }
    }

   
}
