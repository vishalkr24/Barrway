using Barrway.DTO.APIModels.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.SearchAPI
{
    public class SearchResultCalendarModel
    {
        public double last_page { get; set; }
        public List<CalendarModel> data { get; set; }
    }

    public class SearchResultCompanyModel
    {
        public double last_page { get; set; }
        public List<CompanyModel> data { get; set; }
    }
    public class SearchResultBlogModel
    {
        public double last_page { get; set; }
        public List<BlogModel> data { get; set; }
    }
}
