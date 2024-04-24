using Barrway.DTO.APIModels.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.IRepository
{
    public interface IMobileAPIService
    {
        Task<SearchFilterModel> GetSearchFilter();
        Task<List<CategoryModel>> GetCategoryList();
        Task<List<RootCalendarModel>> GetDashboardCalendarList();
        Task<List<FeatureCompanyModel>> GetFeatureCompanies();
        Task<List<FeatureBlogModel>> GetFeatureBlogs();
    }
}
