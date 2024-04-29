using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Dashboard
{
    public class CompanyModel
    {
        public int Id { get; set; }
        public string COMPANY_NAME { get; set; }
        public string COMPANY_CODE { get; set; }
        public string COMPANY_NAME_ENGLISH { get; set; }
        public string COMPANY_BANNER_PATH { get; set; }
        public string COMPANY_LOGO_PATH { get; set; }
        public string COMPANY_BANNER_NAME { get; set; }
        public string TAGS { get; set; }
        public int total_records { get; set; }
        public int page { get; set; }
        public int size { get; set; }
    }
}
