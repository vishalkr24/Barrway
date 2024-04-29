using Barrway.DTO.APIModels.Company;
using Barrway.DTO.APIModels.Dashboard;
using Barrway.DTO.APIModels.SearchAPI;
using Barrway.DTO.Common;
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
        Task<List<CalendarModel>> GetCalendarsSearchResult(SearchAPIModel data, List<string> filters = null);

        Task<List<CompanyModel>> GetCompaniesSearchResult(SearchAPIModel data);
        Task<List<BlogModel>> GetBlogsSearchResult(SearchAPIModel data);

        Task<Company> GetCompany(string CompanyCode);

        Task<AddUpdateDelete> GetCompanyCalendarPackages(string CompanyCode);



    }
}
