using Barrway.DTO.APIModels.Booking;
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
    public class BookingController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;

        public BookingController(IMobileAPIService mobileAPIService)
        {
            this.mobileAPIService = mobileAPIService;
        }

        [HttpGet]
        [Route("api/dashboard/UpcommingBooking")]
        [ResponseType(typeof(ModifiedMyBooking))]
        public async Task<IHttpActionResult> UpcommingBooking()
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var Type = "1";
                    var rr = UserIdentity.UserEmail;
                    var result = await mobileAPIService.GetMyBookings("rohanchaurasia171@gmail.com", Type);

                    return Ok(result);
                }
                else
                {
                    return NotFound();
                }

            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/dashboard/PastBooking")]
        [ResponseType(typeof(ModifiedMyBooking))]
        public async Task<IHttpActionResult> PastBooking()
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var Type = "2";
                    var rr = UserIdentity.UserEmail;
                    var result = await mobileAPIService.GetMyBookings("rohanchaurasia171@gmail.com", Type);

                    return Ok(result);
                }
                else
                {
                    return NotFound();
                }

            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

    }
}
