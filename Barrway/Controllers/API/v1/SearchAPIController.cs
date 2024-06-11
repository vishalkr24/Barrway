using Barrway.DTO.APIModels.Company;
using Barrway.DTO.APIModels.Dashboard;
using Barrway.DTO.APIModels.SearchAPI;
using Barrway.Security;
using Barrway.Service.IRepository;
using Newtonsoft.Json;
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
    public class SearchAPIController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;

        public SearchAPIController(IMobileAPIService mobileAPIService)
        {
            this.mobileAPIService = mobileAPIService;
        }
            
        [Route("api/search/calendars")]
        [HttpPost]
        [ResponseType(typeof(SearchResponseModel<List<CalendarModel>>))]
        public async Task<IHttpActionResult> GetSerachResultCalendar(SearchAPIModel data) {
            try
            {
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
                return Ok(new SearchResponseModel<List<CalendarModel>> { last_page = last_page, data = result, searchType = "calendar" });
            }
            catch (Exception ex) {
                return InternalServerError();
            }
        }

        [Route("api/search/companies")]
        [HttpPost]
        [ResponseType(typeof(SearchResponseModel<List<CompanyModel>>))]
        public async Task<IHttpActionResult> GetSerachResultCompany(CompanySearchApiModel data)
        {
            try
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
                return Ok(new SearchResponseModel<List<CompanyModel>> { last_page = last_page, data = result, searchType = "company" });
            }
            catch (Exception ex) {
                return InternalServerError();
            }
        }

        [Route("api/search/blogs")]
        [HttpPost]
        [ResponseType(typeof(SearchResponseModel<List<BlogModel>>))]
        public async Task<IHttpActionResult> GetSerachResultBlog(BlogSearchAPIModel data)
        {
            try
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
                return Ok(new SearchResponseModel<List<BlogModel>> { last_page = last_page, data = result, searchType = "blog" });
            }
            catch (Exception ex) {
                return InternalServerError();
            }
        }


        [Route("api/blogs/blogDetail/{blogId?}")]
        [HttpPost]
        [ResponseType(typeof(BlogDetailModel))]
        public async Task<IHttpActionResult> GetblogDetail(int blogId)
        {
            try
            {
                var result = await mobileAPIService.GetBlogdetail(blogId);
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }
    }
}
