using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.DTO.APIModels.Dashboard
{
    public class SearchFilterModel
    {
        public SearchFilterModel()
        {
            DistrictList=new List<DistrictFilterModel>();
            SubCategoryList=new List<SubCategoryFilterModel>();
            TagsList = new List<string>();
        }
        public List<DistrictFilterModel> DistrictList { get; set; }
        public List<SubCategoryFilterModel> SubCategoryList { get; set; }
        public List<string> TagsList { get; set; }
    }
    public class DistrictFilterModel
    {
        public int Id { get; set; }
        public string DISTRICT_NAME { get; set; }
    }
    public class SubCategoryFilterModel
    {
        public int Id { get; set; }
        public string CALENDAR_SUB_CATEGORY_NAME { get; set; }
    }
}
