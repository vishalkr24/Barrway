using Barrway.DTO.APIModels.Calendar;
using Barrway.DTO.APIModels.SearchAPI;
using Barrway.DTO.Common;
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
    public class CalendarController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;

        public CalendarController(IMobileAPIService mobileAPIService)
        {
            this.mobileAPIService = mobileAPIService;
        }

        [Route("api/calendar/events")]
        [HttpPost]
        [ResponseType(typeof(List<IDictionary<string, object>>))]
        public async Task<IHttpActionResult> GetEvents(CalendarRequestModel data)
        {
            try
            {
                return Ok(await mobileAPIService.GetEvents(data));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }



        [Route("api/calendar/myfavorite/companys")]
        [HttpGet]
        [ResponseType(typeof(List<MyFavouriteCompany>))]
        public async Task<IHttpActionResult> MyfavoriteCompanysList()
        {
            try
            {
                return Ok(await mobileAPIService.GetMyfavoriteCompanyList(APIUserIdentity.UserName));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }



        [Route("api/calendar/myfavorite/AddtoFavoriteCalanders")]
        [HttpPost]
        [ResponseType(typeof(AddUpdateDeleteAPI))]
        public async Task<IHttpActionResult> AddtoFavoriteCalanders(FavoriteCalendarModel data)
        {
            try
            {              

                return Ok(await mobileAPIService.AddToFavoriteCalendar(data, APIUserIdentity.UserName));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }



        [Route("api/calendar/myfavorite/calendars")]
        [HttpPost]
        [ResponseType(typeof(List<FavouriteCalendar>))]
        public async Task<IHttpActionResult> MyFavoriteCalanders(FavouriteClanderData data)
        {
            try
            {
                return Ok(await mobileAPIService.GetMyFavoriteCalendars(data, APIUserIdentity.UserName));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }


        [Route("api/calendar/mywallet/companys")]
        [HttpGet]
        [ResponseType(typeof(List<MyWalletCalander>))]
        public async Task<IHttpActionResult> GetMyWalletCompanyList()
        {
            try
            {
                return Ok(await mobileAPIService.GetMyWalletCompanyList(APIUserIdentity.UserName));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }


        [Route("api/calendar/mywallet/calanders")]
        [HttpPost]
        [ResponseType(typeof(List<MyWalletCalander>))]
        public async Task<IHttpActionResult> GetMyWalletCalendars(MyWalletClanderApiModel data)
        {
            try
            {
                return Ok(await mobileAPIService.GetMyWalletCalendars(data, APIUserIdentity.UserName));
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }
        }

    }
}
