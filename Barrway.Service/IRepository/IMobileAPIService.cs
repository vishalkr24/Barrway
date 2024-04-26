using Barrway.DTO.APIModels.Dashboard;
using Barrway.DTO.APIModels.SearchAPI;
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
        Task<List<CompanyModel>> GetFeatureCompanies();
        Task<List<BlogModel>> GetFeatureBlogs();
        Task<List<CalendarModel>> GetCalendarsSearchResult(SearchAPIModel data);

        Task<List<CompanyModel>> GetCompaniesSearchResult(Bussiness_company data);
        Task<List<BlogModel>> GetBlogsSearchResult(BlogSearchAPIModel data);
        Task<List<BlogModel>> GetSerachCompanyDetails(int Id);


    }
}
