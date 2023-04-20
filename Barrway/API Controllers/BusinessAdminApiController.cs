using Barrway.DTO.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Barrway.API_Controllers
{
    [Route("API/BusinessAdmin/")]
    public class BusinessAdminApiController : ApiController
    {
        [Route("GetBusinessAccountWebiste")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetBusinessAccountWebsite()
        {
            try
            {


                return Request.CreateResponse(HttpStatusCode.OK, new AddUpdateDelete() { Status = true, Message = AppMessage.Success });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new AddUpdateDelete() { Status = false, Message = AppMessage.SomeInternalError });
            }
            
        }
    }
}