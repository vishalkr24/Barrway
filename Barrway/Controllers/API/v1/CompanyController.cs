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

        [Route("api/GetCompanyServices/{CompanyCode?}")]
        [HttpPost]
        public async Task<ComapnyInformationApi<CompanyServiceDetails>> GetCompanyServices(string CompanyCode)
        {
            try
            {
                CompanyServiceDetails Data = new CompanyServiceDetails();
                var companyServiceDescription = await mobileAPIService.GetCompanyServiceDescription(CompanyCode);   
                if(companyServiceDescription.Data != null)
                {                                      
                    Data.ServiceDescription = companyServiceDescription.Data["COMPANY_SERVICE"];
                }                
             
                var ComapServiceList = await mobileAPIService.GetCompanyServiceList(CompanyCode);
                Data.ServiceList = JsonConvert.DeserializeObject<List<ServiceList>>(JsonConvert.SerializeObject(ComapServiceList.Data));
                return new ComapnyInformationApi<CompanyServiceDetails> { Data = Data, Status = true, Message = "Success" };
            }
            catch (Exception ex)
            {
                return new ComapnyInformationApi<CompanyServiceDetails> { Data = null, Status = false, Message = "Error" };
            }
        }


        [Route("api/GetCompanyPackages/{CompanyCode?}")]
        [HttpPost]
        public async Task<ComapnyInformationApi<List<Company>>> GetCompanyPackages(string CompanyCode)
        {
            try
            {
                var Data = await mobileAPIService.GetCompanyCalendarPackages(CompanyCode);

                return new ComapnyInformationApi<List<Company>> { Data = Data, Status = true, Message = "Success" };
            }
            catch (Exception ex)
            {
                return new ComapnyInformationApi<List<Company>> { Data = null, Status = false, Message = "Error" };
            }
        }




        [Route("api/GetCompanyPhotoGallery/{CompanyCode?}")]
        [HttpPost]
        public async Task<ComapnyInformationApi<List<Company>>> GetCompanyPhotoGallery(string CompanyCode)
        {
            try
            {
                var Data = await mobileAPIService.GetCompanyPhotoGallery(CompanyCode);

                return new ComapnyInformationApi<List<Company>> { Data = Data, Status = true, Message = "Success" };
            }
            catch (Exception ex)
            {
                return new ComapnyInformationApi<List<Company>> { Data = null, Status = false, Message = "Error" };
            }
        }
    }
}
