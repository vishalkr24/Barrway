using Barrway.DTO.APIModels.Calendar;
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
    public class CalendarController : ApiController
    {
        private readonly IMobileAPIService mobileAPIService;

        public CalendarController(IMobileAPIService mobileAPIService)
        {
            this.mobileAPIService = mobileAPIService;
        }

        [Route("api/calendar/events")]
        [HttpPost]
        [ResponseType(typeof(List<IDictionary<string,object>>))]
        public async Task<IHttpActionResult> GetEvents(CalendarRequestModel data)
        {
            try
            {
                return Ok(await mobileAPIService.GetEvents(data));
            } catch(Exception ex)
            {
                return InternalServerError();
            }
        }


        [Route("api/calendar/MyFavoriteCalander")]
        [HttpPost]
        [ResponseType(typeof(FavouriteCalendar))]
        public async Task<IHttpActionResult> MyFavoriteCalanders(FavouriteClanderData data)
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var userId = "";
                    var rr = UserIdentity.UserEmail;
                    return Ok(await mobileAPIService.GetMyFavoriteCalendars(data, UserIdentity.UserName));                    
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
