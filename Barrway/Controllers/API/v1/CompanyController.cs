using Barrway.DTO.APIModels.Company;
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
    public class CompanyController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;

        public CompanyController(IMobileAPIService mobileAPIService)
        {
            this.mobileAPIService = mobileAPIService;
        }


        [Route("api/company/{code?}")]
        [HttpGet]
        [ResponseType(typeof(Company))] // Specify the response type
        public async Task<IHttpActionResult> GetCompany(string code)
        {
            try
            {
                var company = await mobileAPIService.GetCompany(code);

                if (company == null)
                {
                    return NotFound(); // Return 404 status code
                }

                return Ok(company); // Return 200 status code with the company data
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [Route("api/company/{code?}/service")]
        [HttpGet]
        [ResponseType(typeof(CompanyServiceDetails))]
        public async Task<IHttpActionResult> GetCompanyServices(string code)
        {
            try
            {
                var company = await mobileAPIService.GetCompany(code);

                if (company == null)
                {
                    return NotFound(); // Return 404 status code
                }
                CompanyServiceDetails response = new CompanyServiceDetails() { SERVICE_DESC=company.COMPANY_SERVICE};
                response.SERVICE_LIST = await mobileAPIService.GetCompanyServiceList(code);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }


        [Route("api/company/{code?}/package")]
        [HttpGet]
        [ResponseType(typeof(Dictionary<string, List<IDictionary<string, object>>>))]
        public async Task<IHttpActionResult> GetCompanyPackages(string code)
        {
            try
            {
                var company = await mobileAPIService.GetCompany(code);

                if (company == null)
                {
                    return NotFound(); // Return 404 status code
                }

                return Ok(await mobileAPIService.GetCompanyCalendarPackages(code));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [Route("api/company/{code?}/photos")]
        [HttpGet]
        [ResponseType(typeof(List<PhotoGalleryModel>))]
        public async Task<IHttpActionResult> GetCompanyPhotoGallery(string code)
        {
            try
            {
               return Ok(await mobileAPIService.GetCompanyPhotoGallery(code));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }
    }
}
