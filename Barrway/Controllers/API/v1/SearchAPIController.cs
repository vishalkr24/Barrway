using Barrway.DTO.APIModels.Dashboard;
using Barrway.DTO.APIModels.SearchAPI;
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
    public class SearchAPIController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;

        public SearchAPIController(IMobileAPIService mobileAPIService)
        {
            this.mobileAPIService = mobileAPIService;
        }
        [Route("api/search/calendars")]
        [HttpPost]
        public async Task<SearchResponseModel<List<CalendarModel>>> GetSerachResultCalendar(SearchAPIModel data) {
            var result = await mobileAPIService.GetCalendarsSearchResult(data);
            double last_page = 0;
            if (result != null && result.Count() > 0)
            {
                var first_data = result.FirstOrDefault();
                if (first_data.total_records == 0 && first_data.size == 0)
                {
                    last_page = 0;
                }
                else
                {
                    double paging = (double)first_data.total_records / first_data.size;
                    last_page = Math.Floor(paging) + 1;
                }
            }
          return new SearchResponseModel<List<CalendarModel>> { last_page=last_page,data= result,searchType="calendar" };
        }
        [Route("api/search/companies")]
        [HttpPost]
        public async Task<SearchResponseModel<List<CompanyModel>>> GetSerachResultCompany(Bussiness_company data)
        {
            var result = await mobileAPIService.GetCompaniesSearchResult(data);
            double last_page = 0;
            if (result != null && result.Count() > 0)
            {
                var first_data = result.FirstOrDefault();
                if (first_data.total_records == 0 && first_data.size == 0)
                {
                    last_page = 0;
                }
                else
                {
                    double paging = (double)first_data.total_records / first_data.size;
                    last_page = Math.Floor(paging) + 1;
                }
            }
            return new SearchResponseModel<List<CompanyModel>> { last_page = last_page, data = result, searchType = "company" };
        }

        [Route("api/search/blogs")]
        [HttpPost]
        public async Task<SearchResponseModel<List<BlogModel>>> GetSerachResultBlog(BlogSearchAPIModel data)
        {
            var result = await mobileAPIService.GetBlogsSearchResult(data);
            double last_page = 0;
            if (result != null && result.Count() > 0)
            {
                var first_data = result.FirstOrDefault();
                if (first_data.total_records == 0 && first_data.size == 0)
                {
                    last_page = 0;
                }
                else
                {
                    double paging = (double)first_data.total_records / first_data.size;
                    last_page = Math.Floor(paging) + 1;
                }
            }
            return new SearchResponseModel<List<BlogModel>> { last_page = last_page, data = result, searchType = "blog" };
        }


        [Route("api/search/CompanyDetails")]
        [HttpPost]
        public async Task<SearchResponseModel<List<BlogModel>>> GetSerachCompanyDetails(int Id)
        {
            var result = await mobileAPIService.GetSerachCompanyDetails(Id);

            double last_page = 0;
            if (result != null && result.Count() > 0)
            {
                var first_data = result.FirstOrDefault();
                if (first_data.total_records == 0 && first_data.size == 0)
                {
                    last_page = 0;
                }
                else
                {
                    double paging = (double)first_data.total_records / first_data.size;
                    last_page = Math.Floor(paging) + 1;
                }
            }
            return new SearchResponseModel<List<BlogModel>> { last_page = last_page, data = result, searchType = "blog" };
        }
    }
}
