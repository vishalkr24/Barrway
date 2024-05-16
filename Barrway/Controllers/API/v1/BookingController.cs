using Barrway.DTO.APIModels.Booking;
using Barrway.DTO.APIModels.Calendar;
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
        [Route("api/user/BookinggDetails")]
        [ResponseType(typeof(ModifiedMyBooking))]
        public async Task<IHttpActionResult> BookinggDetails(string EventId)
        {
            try
            {                              
                var result = await mobileAPIService.GetMyBookingsDetails( APIUserIdentity.UserEmail, EventId);
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


        


        [HttpPost]
        [Route("api/user/PaymentHistory")]
        [ResponseType(typeof(List<PaymentHistoryApiModel>))]
        public async Task<IHttpActionResult> PaymentHistory(PaymentHistorySearchApiModel data)
        {
            try
            {
                var result = await mobileAPIService.PaymentHistory(data, APIUserIdentity.UserName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }


        [HttpGet]
        [Route("api/user/PaymentCompanyList")]
        [ResponseType(typeof(List<MyFavouriteCompany>))]
        public async Task<IHttpActionResult> PaymentCompanyList()
        {
            try
            {
                var result = await mobileAPIService.GetPaymentCompanyList(APIUserIdentity.UserName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/user/PaymentYearList")]
        [ResponseType(typeof(List<MyFavouriteCompany>))]
        public async Task<IHttpActionResult> PaymentYearList()
        {
            try
            {
                var result = await mobileAPIService.GetPaymentYearList(APIUserIdentity.UserName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

    }
}
