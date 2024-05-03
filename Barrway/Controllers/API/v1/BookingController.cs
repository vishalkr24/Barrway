using Barrway.DTO.APIModels.Booking;
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

        [HttpPost]
        [Route("api/user/upcommingbooking")]
        [ResponseType(typeof(List<ModifiedMyBooking>))]
        public async Task<IHttpActionResult> UpcommingBooking(MyBookingApiModel model)
        {
            try
            {
                var result = await mobileAPIService.GetMyBookings(model,APIUserIdentity.UserEmail, "1");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        [Route("api/user/pastbooking")]
        [ResponseType(typeof(List<ModifiedMyBooking>))]
        public async Task<IHttpActionResult> PastBooking(MyBookingApiModel model)
        {
            try
            {
                var result = await mobileAPIService.GetMyBookings(model, APIUserIdentity.UserEmail, "2");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

    }
}
