using Barrway.DTO.APIModels.Dashboard;
using Barrway.Security;
using Barrway.Service.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Barrway.Controllers.API.v1
{
    [JwtAuthentication]
    public class DashboardController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;

        public DashboardController(IMobileAPIService mobileAPIService)
        {
            this.mobileAPIService = mobileAPIService;
        }
        [HttpGet]
        [Route("api/dashboard/filters")]
        public async Task<SearchFilterModel> GetSearchFilters() { 
        return await mobileAPIService.GetSearchFilter();
        }
        [HttpGet]
        [Route("api/dashboard/categories")]
        public async Task<List<CategoryModel>> GetCategoryList()
        {
            return await mobileAPIService.GetCategoryList();
        }

        [HttpGet]
        [Route("api/dashboard/info")]
        public async Task<DashboardInfoData> GetDashboardData()
        {
            DashboardInfoData dashboardInfo = new DashboardInfoData();
            dashboardInfo.calendars = await mobileAPIService.GetDashboardCalendarList();
            dashboardInfo.feature_blogs = await mobileAPIService.GetFeatureBlogs();
            dashboardInfo.feature_companies=await mobileAPIService.GetFeatureCompanies();
            return dashboardInfo;
        }
    }
}
