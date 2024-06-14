using Barrway.DTO.APIModels.Account;
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
using System.Web.Http.Description;

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
        [ResponseType(typeof(SearchFilterModel))]
        public async Task<IHttpActionResult> GetSearchFilters()
        {
            try
            {
                return Ok(await mobileAPIService.GetSearchFilter());
            }
            catch(Exception ex){
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/dashboard/categories")]
        [ResponseType(typeof(List<CategoryModel>))]
        public async Task<IHttpActionResult> GetCategoryList()
        {
            try
            {
                return Ok(await mobileAPIService.GetCategoryList());
            }
            catch(Exception ex){
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/dashboard/info")]
        [ResponseType(typeof(DashboardInfoData))]
        public async Task<IHttpActionResult> GetDashboardData()
        {
            try
            {
                DashboardInfoData dashboardInfo = new DashboardInfoData();
                dashboardInfo.calendars = await mobileAPIService.GetDashboardCalendarList();
                dashboardInfo.feature_blogs = await mobileAPIService.GetFeatureBlogs();
                dashboardInfo.feature_companies = await mobileAPIService.GetFeatureCompanies();
                return Ok(dashboardInfo);
            } catch(Exception ex) {
                return InternalServerError();
            }
        }


      
    }
}
